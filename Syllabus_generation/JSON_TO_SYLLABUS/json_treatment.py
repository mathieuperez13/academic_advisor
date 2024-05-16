#JSON TRAITEMENT 


import streamlit as st
import json
import openai
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER
from reportlab.lib.enums import TA_JUSTIFY, TA_LEFT
from reportlab.lib.colors import black
import base64
import os


# Vérifier et créer un dossier pour les syllabus générés si nécessaire
output_folder = "syllabus_generé_chat_orientation"
if not os.path.exists(output_folder):
    os.makedirs(output_folder)


# Fonction pour générer un syllabus condensé avec GPT-4
def generate_syllabus(course_description_molly_template_more_data, course_example_molly_template):
    try:
        client = openai.OpenAI(api_key="OPEN_AI_API_KEY")
        prompt = ("You are an expert of syllabus generation. Based on the example below:\n\n" + course_example_molly_template + "\n\n Create a syllabus with this data\n\n" +
                  course_description_molly_template_more_data + "\n\n If you don't hvae the information on the data, doesn't invent and leaves empty. I repeat, you must not invent any data and stick to the data I've given you.")
        
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
    doc = SimpleDocTemplate(output_path, pagesize=letter, rightMargin=72, leftMargin=72,
                            topMargin=72, bottomMargin=18)
    story = []
    styles = getSampleStyleSheet()

    # Définir les styles
    title_style = ParagraphStyle('TitleStyle', parent=styles['Heading1'], alignment=TA_CENTER, fontSize=16, spaceAfter=12, spaceBefore=12)
    subtitle_style = ParagraphStyle('SubtitleStyle', parent=styles['Heading2'], fontSize=13, spaceBefore=12, spaceAfter=6, alignment=TA_JUSTIFY)
    body_style = styles['BodyText']
    body_style.alignment = TA_JUSTIFY
    body_style.spaceBefore = 0
    body_style.spaceAfter = 0

    # Traitement du texte
    sections = syllabus_text.split('\n\n')
    first_line = True
    for section in sections:
        if section.strip() == "":
            continue  # Ignorer les lignes vides
        lines = section.split('\n')
        if first_line:
            p = Paragraph(lines[0], title_style)
            story.append(p)
            first_line = False
            # Traitement des lignes d'information du cours sans espacement
            p = Paragraph('<br/>'.join(lines[1:]), body_style)
            story.append(p)
        else:
            # Sous-titre et contenu du paragraphe
            p = Paragraph(lines[0], subtitle_style)
            story.append(p)
            p = Paragraph('<br/>'.join(lines[1:]), body_style)
            story.append(p)
        story.append(Spacer(1, 12))  # Ajouter un espace après chaque section

    doc.build(story)



# Streamlit app configuration
st.title("Syllabus Generator")
uploaded_file = st.file_uploader("Upload a JSON file with course data", type="json")

if uploaded_file is not None:
    st.success("File uploaded successfully!")
    courses = json.loads(uploaded_file.getvalue().decode("utf-8"))

    for course in courses:
        st.subheader(f"Course Title: {course['title']}")
        


        #NOUVEAU TEMPLATE AVEC LES DONNÉES 
        course_description_molly_template_more_data = f'''
        {course['title']}

        Course ID: {course['Course Code']}
        Course Unit: {course['course_unit']}
        Available for {course['semester']}
        Category: {course['Category']}
        Prerequisites for this course: {course['prerequisites']}

        Course Description and Level:
        {course['info']}

        Class Structure:
        {course['class_structure']}

        Out-of-class Activities:
        {course['Out-of-class Activities']}

        Outline of Assignments & Assessments:
        - Assessment Method: {course['assessment_method']}

        Course Review: 
        This is some information and grades about this course.
        - Course quality: {course['Course Quality']}
        - Course difficulty: {course['Course Difficulty']}
        - Work required: {course['Work Required']}
        - Instructor rating: {course['Instructor Rating']}
        '''



        #BON EXEMPLE POUR LA SUITE
        course_example_molly_template = f'''
        Visual Culture through the Computer's Eye

        Course ID: CIS 1070
        Course Unit: 1 Course Unit
        Available for Fall or Spring Semester
        Category: Engineering
        Prerequisites for this course: No prerequisites

        Course Description and Level:
        Visual studies and the humanities more generally have thought about and modeled seeing of artworks for many centuries. What useful tools can machine learning develop from databases of art historical images or other datasets of visual culture? Can tools from machine learning help visual studies ask new questions? When put together, what can these fields teach us about visual learning, its pathways, its underlying assumptions, and the effects of its archives/datasets?

        Class Structure:
        - Recitation is Monday between 9am to 11am and mandatory for 2 hours.
        - Lecture is Wednesday between 10am and 11am and mandatory for 1 hour.

        Out-of-class Activities:
        - Weekly reading assignments from the e-book "Principles of Economics" on Top Hat.
        - Bi-weekly group homework to encourage collaboration among students.
        - Participation in discussion forums on Canvas and Slate for course-related and community-building topics.

        Outline of Assignments & Assessments:
        - Types of assignments: Weekly reading assignments, bi-weekly group homework, and weekly quizzes.

        Course Review: 
        This is some informations and grades about this course.
        - The course quality is 1.76,
        - The course difficulty is 1.77,
        - The work required 1.44
        - Instructor rating is 1.83.
        '''

        condensed_syllabus = generate_syllabus(course_description_molly_template_more_data, course_example_molly_template )
        st.text(condensed_syllabus)

        # Generate PDF and offer download
        pdf_output_path = f"{course['title'].replace(' ', '_')}_syllabus.pdf"
        create_pdf(condensed_syllabus, pdf_output_path)
        
        with open(pdf_output_path, "rb") as pdf_file:
            pdf_data = pdf_file.read()
        base64_pdf = base64.b64encode(pdf_data).decode('utf-8')
        st.download_button(
            label="Download Syllabus PDF",
            data=pdf_data,
            file_name=pdf_output_path,
            mime="application/pdf"
        )
        st.markdown(f'<iframe src="data:application/pdf;base64,{base64_pdf}" width="700" height="1000" type="application/pdf"></iframe>', unsafe_allow_html=True)
        st.markdown("---")  # Visual separator for clarity













