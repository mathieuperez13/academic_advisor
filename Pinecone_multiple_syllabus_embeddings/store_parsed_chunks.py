import logging
from parsed_chunks_file import ParsedChunksFile
from pinecone_api_client import PineconeApiClient
from config import PINECONE_BATCH_SIZE

async def store_parsed_chunks(
        parsed_chunks_file : ParsedChunksFile,
        namespace = ""
    ):
    metadatas, chunks = parsed_chunks_file.get_chunks_with_metadata()
    total_vectors_stored = 0
    # Store Chunks
    i = 0
    while i < len(chunks):
        vectors_stored = PineconeApiClient().vectorstore.add_texts(
            texts=chunks[i: i + PINECONE_BATCH_SIZE],
            metadatas=metadatas[i: i + PINECONE_BATCH_SIZE],
            namespace=namespace,
            batch_size=PINECONE_BATCH_SIZE
        )
        total_vectors_stored += len(vectors_stored)
        i+=PINECONE_BATCH_SIZE
    
    logging.info(f"Stored {total_vectors_stored} vectors from file {parsed_chunks_file.get_filename()} into namespace {namespace}")
    return total_vectors_stored

