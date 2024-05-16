from langchain_openai import OpenAIEmbeddings
import os
from openai import OpenAI

class OpenAIApiClient:
    """
    A singleton class representing OpenAI third-party API client.

    This class is designed to provide a single instance of the OpenAI's API client
    to avoid unnecessary reinitialization.

    Example:
        Usage of the OpenAIApiClient:

        ```python
        api_client = OpenAIApiClient()
        ```
    """
    _instance = None
 
    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(OpenAIApiClient, cls).__new__(cls)
            cls.text_embeddings = OpenAIEmbeddings(
                #openai_api_key="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",
                openai_api_key ="OPENAI_API_KEY",
                model="text-embedding-ada-002"
            )
            cls.open_ai_client = OpenAI(api_key="OPENAI_API_KEY")
            

        return cls._instance
