from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from botocore.exceptions import ClientError
from api.model import Post, NewPost, UpdatePost
import api.service as service

# Run server: fastapi dev api.py
app = FastAPI()

@app.exception_handler(ClientError)
async def dynamo_error_handler(request: Request, exc: ClientError):
  http_status_code=exc.response["ResponseMetadata"]["HTTPStatusCode"]
  code = exc.response["Error"]["Code"]
  message = exc.response["Error"]["Message"]
  raise HTTPException(status_code=http_status_code, detail=f"{code}, {message}")

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.post("/")
def create(post: NewPost) -> Post:
  return service.create(post)

@app.get("/")
def get_all() -> list[Post]:
  return service.get_all()

@app.put("/{id}")
def update(id: str, post: UpdatePost) -> UpdatePost:
  return service.update(id, post)

@app.delete("/{id}")
def delete(id: str):
  return service.delete(id)
