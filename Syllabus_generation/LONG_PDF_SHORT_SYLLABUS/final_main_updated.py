#CODE ENTIER QUI FONCTIONNE POUR POUVOIR GÉNÉRER UN SYLLABUS POUR LES ÉTUDIANTS À PARTIR D'UN SYLLABUS DÉJÀ EXISTANT PLUS LONG 
#FICHIER NECESSAIRE : 
#- template_short_syllabus_static.txt POUR L'EXEMPLE 
#FAIRE UN TEST POUR LE REMPLACER PAR NEW_TEMPLATE_EXEMPLE.TXT

import streamlit as st
import fitz  # PyMuPDF (MuPDF)
import os
import openai
import base64
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER  # Import for text alignment
from reportlab.lib.colors import black

# Fonction pour sauvegarder le fichier uploadé
def save_uploaded_file(uploaded_file):
    if not os.path.exists('tempDir'):
        os.makedirs('tempDir')
    file_path = os.path.join("tempDir", uploaded_file.name)
    with open(file_path, "wb") as f:
        f.write(uploaded_file.getbuffer())
    return file_path

# Fonction pour extraire le texte et les images d'un PDF
def extract_text_and_images(pdf_path):
    document = fitz.open(pdf_path)
    text_output = []
    images_output = []
    for page_num, page in enumerate(document, start=1):
        text = page.get_text()
        text_output.append(f"Page {page_num}:\n{text}\n")
        image_list = page.get_images(full=True)
        for img_index, img in enumerate(image_list):
            xref = img[0]
            base_image = document.extract_image(xref)
            image_bytes = base_image["image"]
            image_filename = f"image_page_{page_num}_img_{img_index}.png"
            with open(image_filename, "wb") as img_file:
                img_file.write(image_bytes)
            images_output.append(image_filename)
    document.close()
    return text_output, images_output

# Fonction pour lire un fichier
def read_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except FileNotFoundError:
        return "Error: The file was not found."
    except Exception as e:
        return f"An error occurred: {str(e)}"

# Fonction pour générer un syllabus condensé avec GPT-4
def generate_condensed_syllabus(text, example):
    try:
        client = openai.OpenAI(api_key="sk-proj-EbsswciW1QbyS50aDohkT3BlbkFJgawGIcLqmGMMNjCEe00M")
        prompt = ("Below is an example of a well-condensed syllabus:\n\n" +
                  example + "\n\n" +
                  "Using the same format and style as the example above, condense the following syllabus into a one-page summary:\n\n" +
                  text)
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1024,
            temperature=0.5,
            top_p=1.0,
            stream=False
        )
        return response.choices[0].message.content
    except Exception as e:
        return str(e)


def create_pdf(syllabus_text, output_path):
    doc = SimpleDocTemplate(output_path, pagesize=letter)
    story = []
    styles = getSampleStyleSheet()
    base_style = styles['Normal']
    base_style.fontName = 'Times'
    base_style.fontSize = 11
    base_style.leading = 14
    base_style.leftIndent = 0
    base_style.rightIndent = 0
    base_style.spaceAfter = 6
    base_style.alignment = TA_JUSTIFY

    title_style = ParagraphStyle('TitleStyle', parent=base_style, fontSize=12, spaceAfter=6, spaceBefore=12, textColor=black, fontName='Times-Bold')
    course_name_style = ParagraphStyle('CourseNameStyle', parent=base_style, fontSize=14, textColor=black, fontName='Times-Bold', alignment=TA_CENTER, spaceAfter=12, spaceBefore=0)
    second_line_style = ParagraphStyle('SecondLineStyle', parent=base_style, fontSize=13, textColor=black, fontName='Times-Bold', alignment=TA_CENTER, spaceAfter=20, spaceBefore=6)

    line_count = 0
    paragraphs = syllabus_text.split('\n')
    for paragraph in paragraphs:
        if paragraph.strip():  # Skip empty paragraphs
            line_count += 1
            if line_count == 1:
                para_style = course_name_style
            elif line_count == 2:
                para_style = second_line_style
            elif paragraph.endswith(':'):
                para_style = title_style
            elif paragraph.strip().startswith('-'):
                para_style = ParagraphStyle('DashStyle', parent=base_style, spaceBefore=0, spaceAfter=0)
            else:
                para_style = base_style

            para = Paragraph(paragraph, style=para_style)
            story.append(para)

    doc.build(story)



# Streamlit app
st.sidebar.title("Short Student Syllabus Generation")
uploaded_file = st.sidebar.file_uploader("Choose a Syllabus file (.pdf)", type="pdf")

if uploaded_file is not None:
    saved_path = save_uploaded_file(uploaded_file)
    if saved_path:
        st.sidebar.success(f"File uploaded successfully: {saved_path}")
        text_output, images_output = extract_text_and_images(saved_path)
        results_path = "extraction_results.txt"
        with open(results_path, "w") as f:
            for text in text_output:
                f.write(text + "\n")
        st.sidebar.success(f"Text extracted and saved to {results_path}")
        template_example_text = read_file("template_short_syllabus_static.txt")
        if not template_example_text.startswith("Error"):
            condensed_syllabus = generate_condensed_syllabus(read_file(results_path), template_example_text)
            pdf_output_path = "output_syllabus.pdf"
            create_pdf(condensed_syllabus, pdf_output_path)

            # Assurez-vous de lire et d'encoder le fichier PDF avant de fermer le fichier
            with open(pdf_output_path, "rb") as pdf_file:
                pdf_data = pdf_file.read()  # Lire le contenu du fichier avant qu'il ne soit fermé

            # Encodez en base64 pour l'incorporer dans une iframe
            base64_pdf = base64.b64encode(pdf_data).decode('utf-8')

            st.download_button(
                label="Download Syllabus PDF",
                data=pdf_data,
                file_name=pdf_output_path,
                mime="application/pdf"
            )

            # Affichez le PDF dans une iframe
            st.markdown(
                f'<iframe src="data:application/pdf;base64,{base64_pdf}" width="700" height="1000" type="application/pdf"></iframe>',
                unsafe_allow_html=True
            )