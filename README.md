# MERN Task Management System

A full-stack Task Management System built with **MongoDB, Express.js, React.js, and Node.js**.

## Features

- JWT-based authentication (register/login)
- Secure password hashing with bcrypt
- Personal tasks (visible/editable only by creator)
- Assigned tasks (visible to assigner + assignee)
- Role-based field permissions for assigned tasks:
  - **Assignee:** can update **status only**
  - **Assigner:** can update **due date only**
- Protected backend routes
- Dashboard with loading/empty/error states

## Tech Stack

- **Frontend:** React + Vite + React Router
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcryptjs

## Project Structure

- `backend/` Express API + MongoDB models
- `frontend/` React client app

## Setup Instructions

### 1) Clone and install dependencies

```bash
git clone <your-repo-url>
cd ToDo--Task
cd backend && npm install
cd ../frontend && npm install
```

### 2) Configure environment

Copy the backend env template:

```bash
cd backend
cp .env.example .env
```

Set values in `backend/.env`:

- `MONGODB_URI`
- `JWT_SECRET`
- `PORT`
- `CLIENT_URL`

### 3) Seed sample users (optional but recommended)

```bash
cd backend
npm run seed
```

### 4) Run backend and frontend

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

## Sample User Credentials

(Available after running `npm run seed`)

1. **Alice Manager**
   - Email: `alice@example.com`
   - Password: `Password123!`
2. **Bob Contributor**
   - Email: `bob@example.com`
   - Password: `Password123!`

## API Endpoints (Summary)

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected)
- `GET /api/tasks` (protected)
- `POST /api/tasks` (protected)
- `PATCH /api/tasks/:id` (protected, permission-checked)
- `DELETE /api/tasks/:id` (protected, creator-only)
- `GET /api/tasks/meta/users` (protected)

## Deployed App

- Frontend: `https://your-frontend-url.example.com`
- Backend: `https://your-backend-url.example.com`

> Replace these with your real deployment URLs before submission.
