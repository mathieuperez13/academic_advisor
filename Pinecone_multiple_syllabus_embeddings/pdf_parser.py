
#CODE POUR LA DÉMO SUR STREAMLIT - CHANGEMENT POUR INTÉGRER LE DIRECTION D'UN CHEMIN POUR LE PDF ET PAS LE FILEUPLOAD
from chunk_model import Chunk
from parsed_chunks_file import ParsedChunksFile
from langchain.text_splitter import RecursiveCharacterTextSplitter
from PyPDF2 import PdfReader
import logging
import os
from config import CHUNK_SIZE
from config import CHUNK_OVERLAP
from config import *

async def pdf_parser(file_path, metadata: dict = {}):
    """
    Parses a PDF from a file path and returns both the content and parsed chunks.

    Parameters:
    - file_path (str): Path to the PDF file

    Returns:
    tuple: (ParsedChunksFile, full text content)
    """
    filename = os.path.basename(file_path)
    logging.info("Parsing pdf: " + filename)
    pdf_reader = PdfReader(file_path)
    content = ""
    for page in pdf_reader.pages:
        content += page.extract_text() or ""

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", " ", ""]
    )

    chunks = text_splitter.split_text(content)
    
    parsed_file = ParsedChunksFile(filename=filename)
    parsed_file.add_chunks(
        [Chunk(metadata={"filename": filename, **metadata}, text=chunk) for chunk in chunks]
    )

    return parsed_file, content  # Return both the parsed file and the full content
