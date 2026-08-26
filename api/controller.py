from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from botocore.exceptions import ClientError
from api.model import Post, NewPost, UpdatePost
import api.service as service

# Run server: uvicorn api.controller:app --reload --reload-dir api
app = FastAPI()


@app.exception_handler(ClientError)
async def dynamo_error_handler(request: Request, exc: ClientError):
    http_status_code = exc.response["ResponseMetadata"]["HTTPStatusCode"]
    code = exc.response["Error"]["Code"]
    message = exc.response["Error"]["Message"]
    return JSONResponse(
        status_code=http_status_code, content={"detail": f"{code}, {message}"}
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/posts")
def create(post: NewPost) -> Post:
    return service.create(post)


@app.get("/posts")
def get_all() -> list[Post] | dict:
    return service.get_all()


@app.put("/posts/{id}")
def update(id: str, post: UpdatePost) -> Post:
    return service.update(id, post)


@app.delete("/posts/{id}")
def delete(id: str):
    return service.delete(id)
