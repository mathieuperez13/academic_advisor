from typing import Dict, Any
from pydantic import BaseModel


class Chunk(BaseModel):
    text: str
    metadata: Dict[str, Any]

    def update_metadata(self, key: str, value: Any):
        self.metadata[key] = value

    def remove_metadata(self, key: str):
        if key in self.metadata:
            del self.metadata[key]