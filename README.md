# Crudly

A full-stack CRUD application for creating, reading, editing, and deleting posts in a simple social feed.

![Crudly Screenshot](image.png)

## Tech Stack

**Frontend:** HTML, CSS, Vanilla JavaScript (ES6 modules)

**Backend:** Python, FastAPI, Pydantic, AWS DynamoDB (via boto3)

## Features

- View a feed of posts fetched from the backend
- Create new posts via a text input form
- Edit posts inline
- Delete posts from the feed
- Timestamps displayed on each post

## Getting Started

### Prerequisites

- Python 3
- AWS account with a DynamoDB table named `Posts` in `ap-southeast-2`
- AWS credentials configured locally

### Install dependencies

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Seed the database (optional)

```bash
python seed.py
```

### Run the backend

```bash
fastapi dev api.py
```

### Run the frontend

Open `index.html` in a browser, or serve it locally:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## API Endpoints

| Method | Route   | Description         |
| ------ | ------- | ------------------- |
| GET    | `/`     | Get all posts       |
| POST   | `/`     | Create a new post   |
| PUT    | `/`     | Update a post       |
| DELETE | `/{id}` | Delete a post by ID |

\*README generated using Claude CLI
