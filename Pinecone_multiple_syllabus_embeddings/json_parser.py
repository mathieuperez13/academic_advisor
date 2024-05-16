import json
import logging
import os
from chunk_model import Chunk
from parsed_chunks_file import ParsedChunksFile
from config import CHUNK_SIZE, CHUNK_OVERLAP
from langchain.text_splitter import RecursiveCharacterTextSplitter

async def json_parser(file_path, metadata: dict = {}):
    """
    Parses a JSON file containing course information and returns structured chunks.
    
    Parameters:
    - file_path (str): Path to the JSON file

    Returns:
    tuple: (ParsedChunksFile, full text content as string for display)
    """
    filename = os.path.basename(file_path)
    logging.info("Parsing JSON: " + filename)
    
    with open(file_path, 'r', encoding='utf-8') as file:
        courses = json.load(file)

    full_text = ""  # To accumulate all text for display
    parsed_file = ParsedChunksFile(filename=filename)

    for course in courses:
        # Concatenate relevant information for chunking
        course_info = f"{course['title']} - {course['info']} - Semester: {course['semester']} - Prerequisites: {course['prerequisites']} - Course Unit: {course['course_unit']} - Assessment Method: {course['assessment_method']} - Category: {course['Category']} - Course Quality: {course['Course Quality']} - Instructor Rating: {course['Instructor Rating']} - Course Difficulty: {course['Course Difficulty']} - Work Required: {course['Work Required']}"
        full_text += course_info + "\n"

        # Use a text splitter to break down the course info into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=CHUNK_SIZE,
            chunk_overlap=CHUNK_OVERLAP,
            separators=["\n\n", "\n", " ", ""]
        )
        chunks = text_splitter.split_text(course_info)

        # Add chunks to parsed file
        for chunk in chunks:
            chunk_metadata = {
                "filename": filename,
                "title": course['title'],
                "semester": course['semester'],
                "prerequisites": course['prerequisites'],
                "course_unit": course['course_unit'],
                "assessment_method": course['assessment_method'],
                "category": course['Category'],
                "course_quality": course['Course Quality'],
                "instructor_rating": course['Instructor Rating'],
                "course_difficulty": course['Course Difficulty'],
                "work_required": course['Work Required'],
                **metadata
            }
            parsed_file.add_chunk(Chunk(metadata=chunk_metadata, text=chunk))

    print("Parsed_file")
    print(parsed_file)
    
    return parsed_file, full_text  # Return both the parsed file and the full concatenated text for display


