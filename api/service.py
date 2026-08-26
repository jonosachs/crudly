import uuid
from datetime import datetime
import api.repo as repo
from api.model import Post, NewPost, UpdatePost


def create(post: NewPost) -> Post:
    id = str(uuid.uuid4())
    timestamp = datetime.now().strftime("%m/%d/%Y, %I:%M:%S %p")
    post = Post(id=id, created=timestamp, updated=None, text=post.text)
    return repo.create(post)


def get_all() -> list[Post] | dict:
    response = repo.get_all()
    return response if len(response) > 0 else {"message": "No posts found"}


def update(id: str, post: UpdatePost) -> UpdatePost:
    timestamp = datetime.now().strftime("%m/%d/%Y, %I:%M:%S %p")
    updated_post = UpdatePost(updated=timestamp, text=post.text)
    return repo.update(id, updated_post)


def delete(id: str) -> dict:
    return repo.delete(id)

