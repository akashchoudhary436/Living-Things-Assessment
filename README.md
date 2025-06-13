# Task Management Application

A full-stack task management application with user authentication, task CRUD operations, and Excel export functionality. Built with a React.js frontend, a Node.js backend for authentication, and a Django REST Framework backend for task management, using an SQLite database.

## Features

- **User Authentication**: Register and login using a Node.js backend, synced with Django.
- **Task Management**:
  - Create, update, and delete tasks with fields: Title, Description, Effort (in days), and Due Date.
  - View tasks specific to the logged-in user.
  - Input validation (non-empty title, valid date).
- **Excel Export**: Download tasks as an Excel file via the Django backend.
- **Responsive UI**: Clean and attractive interface built with React.js and Tailwind CSS.

## Project Structure

```
task-management-app/
├── frontend/               # React.js frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Tasks.jsx
│   │   ├── App.jsx
│   │   └── index.css
├── backend1/               # Node.js authentication API
│   ├── index.js
│   ├── users.db
│   └── package.json
├── backend2/               # Django REST Framework API
│   ├── manage.py
│   ├── tasks/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   └── task_manager/
│       ├── settings.py
│       └── urls.py
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- SQLite (included with Python)
- npm (comes with Node.js)
- pip (comes with Python)
- Git (for cloning the repository)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-management-app
```

### 2. Backend 1: Node.js Authentication API

Navigate to the Node.js backend:

```bash
cd backend1
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `backend1` directory with the following content:

```
JWT_SECRET=your-secret-key
```

Replace `your-secret-key` with a secure random string.

Start the Node.js server:

```bash
npm start
```

The server runs on `http://localhost:3000`.

### 3. Backend 2: Django REST Framework API

Navigate to the Django backend:

```bash
cd ../backend2
```

Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

Install dependencies:

```bash
pip install django djangorestframework django-cors-headers openpyxl python-decouple
```

Apply migrations to set up the SQLite database:

```bash
python manage.py migrate
```

Create a superuser (optional, for admin access):

```bash
python manage.py createsuperuser
```

Start the Django server:

```bash
python manage.py runserver
```

The server runs on `http://localhost:8000`.

### 4. Frontend: React.js Application

Navigate to the frontend:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm start
```

The frontend runs on `http://localhost:3001`.

## Usage Instructions

1. **Start the Servers**:
   - Ensure both `backend1` (Node.js) and `backend2` (Django) servers are running.
   - Start the frontend React application.

2. **Access the Application**:
   - Open `http://localhost:3001` in your browser.

3. **Register**:
   - Navigate to `/register` to create a new account.
   - Provide a username and password.

4. **Login**:
   - Navigate to `/login` and enter your credentials.
   - Upon successful login, you’ll be redirected to the `/tasks` page.

5. **Manage Tasks**:
   - **Create**: Fill out the task form with Title, Description, Effort (days), and Due Date.
   - **View**: See all your tasks in a list.
   - **Update**: Click "Edit" on a task to modify its details.
   - **Delete**: Click "Delete" to remove a task.
   - **Export**: Click "Export to Excel" to download your tasks as an Excel file.

6. **Logout**:
   - Click the "Logout" button on the tasks page to return to the login screen.

## API Endpoints

### Node.js Backend (`http://localhost:3000`)

- `POST /api/register`: Register a new user.
- `POST /api/login`: Authenticate a user and return a token.

### Django Backend (`http://localhost:8000`)

- `POST /api/register/`: Sync user registration with Django.
- `POST /api/login/`: Authenticate and return a token.
- `GET /api/tasks/`: List user’s tasks.
- `POST /api/tasks/`: Create a new task.
- `PUT /api/tasks/:id/`: Update a task.
- `DELETE /api/tasks/:id/`: Delete a task.
- `GET /api/tasks/export/`: Export tasks to Excel.