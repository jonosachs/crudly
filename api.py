from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uuid
import boto3
from datetime import datetime

app = FastAPI()

time = datetime.now().strftime("%m/%d/%Y, %I:%M:%S %p")

client = boto3.client("dynamodb", region_name='ap-southeast-2')
dynamodb = boto3.resource("dynamodb", region_name='ap-southeast-2')
table = dynamodb.Table('Posts')

class NewPost(BaseModel):
  text: str

class UpdatePost(BaseModel):
  id: str
  text: str

class Post(BaseModel):
  id: str
  timestamp: str
  text: str

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.get("/")
def get_all():
  response = table.scan()
  return response.get('Items', []) # defaults to empty list


@app.post("/")
def create(post: NewPost):
  newpost = Post(id=str(uuid.uuid4()), timestamp=time, text=post.text)
  table.put_item(Item=newpost.model_dump())
  return newpost


@app.delete("/{id}")
def delete(id: str):
  table.delete_item(Key={'id': id})
  return {"message": f"deleted post-{id}"}

@app.put("/")
def update(post: UpdatePost):
  updated = Post(id=post.id, timestamp=time, text=post.text)
  table.put_item(Item=updated.model_dump())
  return updated