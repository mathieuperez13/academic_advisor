from typing import Any, Dict, List, Tuple
from pydantic import BaseModel
from chunk_model import Chunk

class ParsedChunksFile(BaseModel):
    filename: str
    chunks: List[Chunk] = []

    def get_filename(self):
        """
        Get the file-specific name.

        Returns:
        str: File-specific name.
        """
        return self.filename
    
    def add_chunk(self, chunk: Chunk):
        """
        Add a chunk to the list of chunks.

        Parameters:
        - chunk (Chunk): Chunk object to add.
        """
        self.chunks.append(chunk)

    def add_chunks(self, chunks: List[Chunk]):
        """
        Add chunks to the list of chunks.

        Parameters:
        - chunks (List[Chunk]): List of Chunk objects to add.
        """
        self.chunks.extend(chunks)

    def get_file_metadata(self) -> Dict[str, Any]:
        """
        Get the file-specific metadata.

        Returns:
        dict: File-specific metadata.
        """
        return {"filename": self.filename, "namespace": self.namespace}

    def get_chunks(self) -> List[Chunk]:
        """
        Get the list of chunks.

        Returns:
        list: List of chunks.
        """
        return self.chunks

    def get_chunks_with_metadata(self) -> Tuple[List[Dict[str, Any]], List[str]]:
        """
        Get the list of metadata and chunk raw text separated.

        Returns:
        tuple(list, list): List of chunk metadatas and corresponding chunk raw text
        """
        return [chunk.metadata for chunk in self.chunks], [chunk.text for chunk in self.chunks]