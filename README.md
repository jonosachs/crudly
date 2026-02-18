# Crudly

A full-stack CRUD application for creating, reading, editing, and deleting posts in a simple social feed.

![Crudly Screenshot](image.png)

## Tech Stack

**Frontend:** HTML, CSS, Vanilla JavaScript (ES6 modules)

**Backend:** Python, FastAPI, Pydantic

## Features

- View a feed of posts fetched from the backend
- Create new posts via a text input form
- Edit posts inline
- Delete posts from the feed
- Timestamps displayed on each post

## Getting Started

### Prerequisites

- Python 3
- pip

### Install dependencies

```bash
pip install -r requirements.txt
```

### Run the backend

```bash
python -m uvicorn api:app --reload
```

The API will be available at `http://127.0.0.1:8000/`.

### Run the frontend

Open `index.html` in a browser, or serve it locally:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.

\*README generated using Claude CLI
