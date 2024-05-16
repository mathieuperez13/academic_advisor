
import streamlit as st
import os
import asyncio
import time  # Import pour gérer les délais
from pdf_parser import pdf_parser
from json_parser import json_parser
from store_parsed_chunks import store_parsed_chunks
import dropbox

# Configuration de l'API Dropbox
ACCESS_TOKEN = 'sl.B1EEQxoCDjGiB2KvW8eTyWL3el3weGAIfAZ4nvHltK93M4sseyulxSDh3l6-kUoc759zCYhqmdjrSr1T9W8OyMjbjNqVONuIbp7QDxkV5UzSs9zFFOeeQSkK3f1fkZ-7zOhGn1s1Fhrdyvk'  # Assurez-vous de sécuriser votre token d'accès
dbx = dropbox.Dropbox(ACCESS_TOKEN)

def save_file_to_dropbox(uploaded_file, file_path):
    try:
        with open(file_path, "rb") as f:
            dbx.files_upload(f.read(), f'/{uploaded_file.name}', mode=dropbox.files.WriteMode("overwrite"))
        link = dbx.sharing_create_shared_link_with_settings(f'/{uploaded_file.name}', settings=dropbox.sharing.SharedLinkSettings(requested_visibility=dropbox.sharing.RequestedVisibility.public))
        return link.url
    except Exception as e:
        st.error(f"An error occurred: {e}")
        return None

def save_uploaded_file(uploaded_file):
    try:
        file_path = os.path.join("uploaded_files", uploaded_file.name)
        with open(file_path, "wb") as f:
            f.write(uploaded_file.getbuffer())
        st.write("File saved locally at:", file_path)
        return file_path
    except Exception as e:
        st.error(f"An error occurred: {e}")
        return None

if not os.path.exists("uploaded_files"):
    os.mkdir("uploaded_files")
    st.write("Created directory for uploaded files.")

st.title("File Processor for Embeddings")
uploaded_files = st.file_uploader("Choose files", type=['pdf', 'json'], accept_multiple_files=True)

if uploaded_files:
    for uploaded_file in uploaded_files:
        file_details = {"FileName": uploaded_file.name, "FileType": uploaded_file.type, "FileSize": uploaded_file.size}
        st.write(file_details)
        
        saved_file_path = save_uploaded_file(uploaded_file)
        if saved_file_path:
            st.success(f"File {uploaded_file.name} saved successfully in the 'uploaded_files' folder.")
            
            dropbox_link = save_file_to_dropbox(uploaded_file, saved_file_path)
            if dropbox_link:
                st.write(f"File {uploaded_file.name} saved to Dropbox at this link: {dropbox_link}")

            file_extension = os.path.splitext(uploaded_file.name)[1].lower()

            metadata = {
                'course_id': 'Course123', 
                'resource_name': uploaded_file.name, 
                'resource_link': dropbox_link if dropbox_link else "Link unavailable"
            }

            if file_extension == '.pdf':
                st.write(f"Parsing the PDF {uploaded_file.name}...")
                parsed_chunks_file, extracted_content = asyncio.run(pdf_parser(saved_file_path, metadata))
                st.text_area(f"Extracted Text from {uploaded_file.name}", extracted_content, height=300)
                st.write(f"PDF parsing for {uploaded_file.name} completed.")
                num_vectors_uploaded = asyncio.run(store_parsed_chunks(parsed_chunks_file))
                st.write(f"Number of vectors uploaded for {uploaded_file.name}: {num_vectors_uploaded}")

                time.sleep(60)  # Attente de 60 secondes entre chaque traitement de PDF

            elif file_extension == '.json':
                st.write(f"Parsing the JSON {uploaded_file.name}...")
                parsed_chunks_file, extracted_content = asyncio.run(json_parser(saved_file_path, metadata))
                st.text_area(f"Extracted Data from {uploaded_file.name}", extracted_content, height=300)
                st.write(f"JSON parsing for {uploaded_file.name} completed.")
                num_vectors_uploaded = asyncio.run(store_parsed_chunks(parsed_chunks_file))
                st.write(f"Number of vectors uploaded for {uploaded_file.name}: {num_vectors_uploaded}")

            st.write(f"Data processing for {uploaded_file.name} completed.")
        else:
            st.error(f"Failed to save the file {uploaded_file.name}.")
else:
    st.write("No file uploaded yet.")
