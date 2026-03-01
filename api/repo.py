import boto3
from api.model import Post, UpdatePost
from dotenv import load_dotenv
import os

load_dotenv()
db_region = os.getenv("DB_REGION")
db_table = os.getenv("DB_TABLE")

client = boto3.client("dynamodb", region_name=db_region)
dynamodb = boto3.resource("dynamodb", region_name=db_region)
table = dynamodb.Table(db_table)

def create(new_post: Post):
  table.put_item(Item=new_post.model_dump())
  return new_post

def get_all():
  response = table.scan()
  return response.get('Items', []) # defaults to empty list

def update(id: str, updated_post: UpdatePost) -> Post:
  updated = updated_post.updated
  response = table.update_item(
    Key={"id": id}, 
    ExpressionAttributeNames={"#t":"text"},
    UpdateExpression="SET #t = :text, updated = :updated",
    ExpressionAttributeValues={
      ":text": updated_post.text,
      ":updated": updated_post.updated
      
    },
    ReturnValues="ALL_NEW"
  )
  
  return response["Attributes"]

def delete(id: str):
  table.delete_item(Key={'id': id})
  return {"message": f"deleted post-{id}"}
