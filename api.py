from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uuid
import boto3
from datetime import datetime

app = FastAPI()

client = boto3.client("dynamodb", region_name='ap-southeast-2')
dynamodb = boto3.resource("dynamodb", region_name='ap-southeast-2')
table = dynamodb.Table('Posts')

class PostFromUser(BaseModel):
  text: str

class Post(BaseModel):
  id: str
  timestamp: str
  text: str

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"]
  )

@app.get("/")
def get_all():
  response = table.scan()
  return response.get('Items', []) # defaults to empty list


@app.post("/")
def create(post: PostFromUser):
  newpost = Post(id=str(uuid.uuid4()), timestamp=datetime.now().isoformat(), text=post.text)
  table.put_item(Item=newpost.model_dump())
  return newpost


@app.delete("/{id}")
def delete(id: str):
  table.delete_item(Key={'id': id})
  return {"message": f"deleted post-{id}"}

@app.put("/")
def update(post: Post):
  table.put_item(Item=post.model_dump())
  return {"message": f"updated post-{post.id}"}