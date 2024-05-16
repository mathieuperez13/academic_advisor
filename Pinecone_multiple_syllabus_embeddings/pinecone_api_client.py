import os
import sys
import logging

from openai_api_client import OpenAIApiClient
from config import PINECONE_POOL_THREADS
import langchain_pinecone
from pinecone import Pinecone, Index


logging.basicConfig(level=logging.INFO)


class PineconeApiClient:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            logging.info("Initialisation de l'instance PineconeApiClient...")
            cls._instance = super(PineconeApiClient, cls).__new__(cls)
            try:
                #pinecone = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
                pinecone = Pinecone(api_key="5a6353bd-2e4a-436a-b6f4-8a18187884e1")
                cls.index = pinecone.Index("orientation-chat-lucy", pool_threads=PINECONE_POOL_THREADS)
                text_embeddings = OpenAIApiClient().text_embeddings
                cls.vectorstore = langchain_pinecone.Pinecone(cls.index, text_embeddings, "text")
                logging.info("PineconeApiClient a été initialisé avec succès.")
            except Exception as e:
                logging.error(f"Erreur lors de l'initialisation de PineconeApiClient: {e}")
                raise e
        return cls._instance