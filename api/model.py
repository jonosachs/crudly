from pydantic import BaseModel
from typing import Optional

class NewPost(BaseModel):
  text: str

class UpdatePost(BaseModel):
  updated: str
  text: str

class Post(BaseModel):
  id: str
  created: str
  updated: Optional[str] = None
  text: str