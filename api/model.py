from pydantic import BaseModel
from typing import Optional

class NewPost(BaseModel):
  text: str

class UpdatePost(BaseModel):
  text: str
  updated: Optional[str] = None

class Post(BaseModel):
  id: str
  created: str
  updated: Optional[str] = None
  text: str
  
  