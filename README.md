# Task Manager

A full-stack task management application built with Django REST Framework and React.js.

## Features

- User registration and login with JWT authentication
- Create, read, update and delete tasks
- Attach multiple files to a task and remove them individually
- Filter tasks by status (All / Pending / Completed)
- Paginated task list
- Responsive UI

## Tech Stack

**Backend:** Django 6, Django REST Framework, SimpleJWT, SQLite  
**Frontend:** React 19, React Router, Axios  
**Containerization:** Docker, Docker Compose

## Project Structure

```
├── backend/
│   ├── config/          # Django project settings and root URL config
│   ├── accounts/        # User registration and login APIs
│   ├── tasks/           # Task CRUD and attachment APIs
│   ├── Dockerfile
│   ├── requirements.txt
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── pages/       # Login, Register, Dashboard components
│   │   ├── api.js       # Axios instance with JWT interceptor
│   │   ├── App.js       # Route definitions
│   │   └── App.css      # Styles
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register a new user |
| POST | `/api/auth/login/` | Login and get JWT tokens |
| GET | `/api/tasks/` | List tasks (paginated, filterable) |
| POST | `/api/tasks/` | Create a task (supports file attachments) |
| GET | `/api/tasks/<id>/` | Get a single task |
| PUT | `/api/tasks/<id>/` | Update a task (supports file attachments) |
| DELETE | `/api/tasks/<id>/` | Delete a task |
| DELETE | `/api/tasks/<id>/attachments/<attachment_id>/` | Remove an attachment |

## Getting Started

### Run Locally (without Docker)

**Backend:**

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The API will be available at `http://localhost:8000`.

**Frontend:**

```bash
cd frontend
npm install
npm start
```

The app will open at `http://localhost:3000`.

### Run with Docker

```bash
docker-compose up --build
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`

## Environment Notes

- The backend uses SQLite by default, so no external database setup is needed.
- CORS is configured to allow requests from `http://localhost:3000`.
- Uploaded attachments are stored in the `media/` directory on the backend.
- JWT access tokens expire after 1 hour. Refresh tokens last 7 days.
