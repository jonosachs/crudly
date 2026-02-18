from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"]
  )

class Post(BaseModel):
  id: int
  text: str

someposts = [
    Post(id=1, text="A cloud weighs around a million tonnes"), 
    Post(id=2, text="Giraffes are 30 times more likely to get hit by lightning than people."), 
    Post(id=3, text="The Universe's average colour is called 'Cosmic latte'.")
  ]

@app.get("/")
def get_all():
  return someposts

  



