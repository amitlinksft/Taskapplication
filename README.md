# Task Manager

A full-stack task management application built with Django REST Framework and React.js.

## Features

- User registration and login with JWT authentication
- Create, read, update and delete tasks
- Task categories (Work, Personal, Shopping, Health, Study, Finance, Travel, Fitness)
- Filter tasks by status and category
- Attach multiple files to a task and remove them individually
- Paginated task list
- Overdue task highlighting
- Responsive UI

## Tech Stack

**Backend:** Django 6, Django REST Framework, SimpleJWT, SQLite
**Frontend:** React 19, React Router, Axios
**Containerization:** Docker, Docker Compose
**API Docs:** drf-spectacular (Swagger/ReDoc)

## Live Demo

| Service | URL |
|---------|-----|
| Frontend | https://reactapp-fl67-857c.onrender.com |
| Backend API | https://backend-tk2k-lzrm.onrender.com |
| Swagger Docs | https://backend-tk2k-lzrm.onrender.com/api/docs/ |
| ReDoc | https://backend-tk2k-lzrm.onrender.com/api/redoc/ |

## Project Structure

```
├── backend/
│   ├── config/          # Django project settings and root URL config
│   ├── accounts/        # User registration and login APIs
│   ├── tasks/           # Task CRUD, categories, and attachment APIs
│   ├── Dockerfile
│   ├── requirements.txt
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/  # TaskList, TaskForm, CategoryFilter
│   │   ├── context/     # AuthContext (JWT state management)
│   │   ├── pages/       # Login, Register, Dashboard
│   │   ├── services/    # Axios API client with JWT interceptor
│   │   └── App.js       # Route definitions with auth guards
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

## API Documentation

**Live API Docs:**

| URL | Description |
|-----|-------------|
| [Swagger UI](https://backend-tk2k-lzrm.onrender.com/api/docs/) | Interactive docs — test endpoints directly from the browser |
| [ReDoc](https://backend-tk2k-lzrm.onrender.com/api/redoc/) | Clean, readable API reference |
| [OpenAPI Schema](https://backend-tk2k-lzrm.onrender.com/api/schema/) | Raw OpenAPI 3.0 schema (JSON) |

Or when running locally: `/api/docs/`, `/api/redoc/`, `/api/schema/`

## API Endpoints

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register/` | No | Register a new user |
| POST | `/api/auth/login/` | No | Login and get JWT tokens |

**Register** — Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Login** — Request body:
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response** (both endpoints):
```json
{
  "message": "Login successful",
  "tokens": {
    "access": "<jwt_access_token>",
    "refresh": "<jwt_refresh_token>"
  },
  "user": {
    "id": 1,
    "username": "John Doe",
    "email": "john@example.com"
  }
}
```

### Tasks

All task endpoints require `Authorization: Bearer <access_token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/` | List tasks (paginated, filterable) |
| POST | `/api/tasks/` | Create a task |
| GET | `/api/tasks/<id>/` | Get a single task |
| PUT | `/api/tasks/<id>/` | Update a task |
| DELETE | `/api/tasks/<id>/` | Delete a task |
| DELETE | `/api/tasks/<id>/attachments/<attachment_id>/` | Remove an attachment |

**Query Parameters** (GET `/api/tasks/`):

| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter by `Pending` or `Completed` |
| `category` | integer | Filter by category ID |
| `page` | integer | Page number (default: 1) |
| `page_size` | integer | Items per page (default: 5, max: 20) |

**Create/Update Task** — Request body:
```json
{
  "title": "Complete project report",
  "description": "Finish the quarterly report",
  "status": "Pending",
  "due_date": "2026-04-15",
  "category": 1
}
```

**Task Response:**
```json
{
  "id": 1,
  "title": "Complete project report",
  "description": "Finish the quarterly report",
  "status": "Pending",
  "due_date": "2026-04-15",
  "created_at": "2026-04-07T10:30:00Z",
  "is_overdue": false,
  "category": 1,
  "category_detail": {
    "id": 1,
    "name": "Work",
    "symbol": "📼",
    "color": "#4a6cf7"
  },
  "attachments": []
}
```

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/categories/` | List categories (auto-creates defaults on first call) |
| POST | `/api/tasks/categories/` | Create a custom category |
| PUT | `/api/tasks/categories/<id>/` | Update a category |
| DELETE | `/api/tasks/categories/<id>/` | Delete a category |

**Default Categories:** Work, Personal, Shopping, Health, Study, Finance, Travel, Fitness

## Getting Started

### Run with Docker (Recommended)

```bash
docker-compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/api/docs/ |

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

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SECRET_KEY` | insecure default | Django secret key |
| `DEBUG` | `False` | Enable debug mode |
| `ALLOWED_HOSTS` | `*` | Comma-separated allowed hosts |
| `FRONTEND_URL` | — | Frontend URL for CORS |
| `REACT_APP_API_URL` | `http://localhost:8000/api` | Backend API URL for frontend |

## Environment Notes

- The backend uses SQLite as the database.
- CORS is configured to allow requests from `http://localhost:3000` and `FRONTEND_URL`.
- Uploaded attachments are stored in the `media/` directory on the backend.
- JWT access tokens expire after 1 hour. Refresh tokens last 7 days.
- Password minimum length: 8 characters.
