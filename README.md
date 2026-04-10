# Task Management System - MERN Stack

A complete full-stack Task Management application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This application allows users to create, manage, and track personal and assigned tasks with role-based permissions.

## 🚀 Features

### Authentication & Authorization
- ✅ User Registration and Login
- ✅ Secure Password Hashing (bcryptjs)
- ✅ JWT-based Authentication
- ✅ Protected Routes
- ✅ Auto-logout on Token Expiration

### Task Management
- ✅ **Personal Tasks**: Created by user, visible only to creator
- ✅ **Assigned Tasks**: Can be assigned to other users
- ✅ CRUD Operations (Create, Read, Update, Delete)
- ✅ Task Status Tracking (Todo, In Progress, Done)
- ✅ Task Due Dates
- ✅ Task Filtering and Sorting

### Role-Based Permissions

#### Personal Tasks
- Creator can: Create, Edit (all fields), Delete, Update Status

#### Assigned Tasks
- **Assignee**: Can only update task status
- **Assigner**: Can create, edit (title, description, due date, assignee), delete, but **CANNOT** update task status
- Both users can view the task and its progress

## 📋 Tech Stack

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **CORS**: Cross-Origin Resource Sharing

### Frontend
- **React.js**: UI library
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **CSS3**: Styling

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas Cloud Database)
- npm or yarn

### 1. Clone the Repository (if from GitHub)
```bash
git clone https://github.com/yourusername/task-management-system.git
cd task-management-system
```

### 2. Install Dependencies

#### Option A: Install All at Once
```bash
npm install concurrently
npm run install-all
```

#### Option B: Manual Installation
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Configure Environment Variables

#### Backend (.env file in `/server` directory)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/task-management

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_99999
```

**For MongoDB Atlas (Cloud)**:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-management?retryWrites=true&w=majority
```

### 4. MongoDB Setup

#### Option A: Local MongoDB
```bash
# Make sure MongoDB is running
mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string and add to .env

### 5. Start the Application

#### Option A: Run Both Server and Client Together
```bash
# From root directory
npm start
```

#### Option B: Run Separately
```bash
# Terminal 1 - Start Backend (from /server)
cd server
npm run dev

# Terminal 2 - Start Frontend (from /client)
cd client
npm start
```

### Frontend URL
The React app will open automatically at: `http://localhost:3000`

### Backend API URL
Backend server runs at: `http://localhost:5000`

## 👥 Sample User Credentials (Demo)

The following are sample credentials you can use to test the application:

### User 1 - John Doe
```
Email: john@example.com
Password: password123
```

### User 2 - Jane Smith
```
Email: jane@example.com
Password: password456
```

**Note**: You need to register these users first or manually insert them into MongoDB for demo purposes.

### Create Sample Users (Quick Setup)
You can send POST requests to `http://localhost:5000/api/auth/register`:

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

```json
{
  "username": "jane",
  "email": "jane@example.com",
  "password": "password456",
  "confirmPassword": "password456"
}
```

## 📚 API Endpoints

### Authentication Endpoints
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
GET    /api/auth/profile      - Get user profile (Protected)
```

### Task Endpoints (All Protected)
```
POST   /api/tasks             - Create new task
GET    /api/tasks             - Get all tasks for current user
GET    /api/tasks/:id         - Get specific task by ID
PATCH  /api/tasks/:id         - Update task (role-based)
DELETE /api/tasks/:id         - Delete task (creator only)
GET    /api/tasks/users       - Get all users (for assigning)
```

## 🎯 Usage Guide

### 1. Registration
- Click "Register" on the login page
- Fill in username, email, password
- Click "Register" button

### 2. Login
- Enter email and password
- Click "Login" button
- Use demo credentials: `john@example.com` / `password123`

### 3. Create Personal Task
- Click "New Task" button
- Fill in Title, Description, Due Date
- Leave "Assign To" empty for personal task
- Click "Create Task"

### 4. Create Assigned Task
- Click "New Task" button
- Fill in all fields
- Select a user from "Assign To" dropdown
- Click "Create Task"

### 5. Update Task

**For Personal Tasks**
- Click "Edit" button on task card
- Modify any field
- Click "Update Task"

**For Assigned Tasks**
- **As Creator**: Click "Edit" → Update title, description, due date (NOT status)
- **As Assignee**: Click "Update Status" → Change status only

### 6. Delete Task
- Click "Delete" button (only available for creator)
- Confirm deletion

### 7. Filter Tasks
- Use filter buttons: All Tasks, Todo, In Progress, Done
- Tasks update in real-time

## 📁 Project Structure

```
task-management-system/
├── server/                     # Backend
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   └── taskController.js  # Task logic
│   ├── middleware/
│   │   └── auth.js            # JWT verification
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Task.js            # Task schema
│   ├── routes/
│   │   ├── auth.js            # Auth routes
│   │   └── tasks.js           # Task routes
│   ├── utils/
│   │   ├── AppError.js        # Error class
│   │   ├── catchAsync.js      # Async error handler
│   │   └── errorHandler.js    # Global error handler
│   ├── .env                   # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── server.js              # Entry point
│
├── client/                     # Frontend
│   ├── public/
│   │   └── index.html         # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js      # Navigation bar
│   │   │   ├── TaskCard.js    # Task card component
│   │   │   └── TaskModal.js   # Task form modal
│   │   ├── context/
│   │   │   └── AuthContext.js # Auth state management
│   │   ├── pages/
│   │   │   ├── Login.js       # Login page
│   │   │   ├── Register.js    # Register page
│   │   │   └── Dashboard.js   # Task dashboard
│   │   ├── services/
│   │   │   ├── apiClient.js   # Axios instance
│   │   │   ├── authService.js # Auth API calls
│   │   │   └── taskService.js # Task API calls
│   │   ├── styles/
│   │   │   └── index.css      # Global styles
│   │   ├── App.js             # Root component
│   │   └── index.js           # Entry point
│   ├── .gitignore
│   └── package.json
│
├── package.json               # Root package.json
├── .gitignore
└── README.md                  # This file
```

## 🔒 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token-based authentication
- ✅ Protected API routes
- ✅ Role-based access control
- ✅ Secure error messages (no sensitive info leaks)
- ✅ Token expiration (7 days)
- ✅ CORS configuration
- ✅ Environment variables for secrets

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running
```bash
# On Windows
mongod

# On Mac/Linux
brew services start mongodb-community
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change PORT in .env or kill the process using the port

### Module Not Found
```
Cannot find module 'express'
```
**Solution**: Run `npm install` in the respective directory (server/client)

### React App Won't Load
- Clear browser cache (Ctrl+Shift+Delete)
- Restart the development server
- Check console for errors (F12)

## 📝 API Request Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Complete project",
    "description": "Finish MERN stack project",
    "dueDate": "2024-12-31",
    "assignedTo": "USER_ID_OR_EMPTY"
  }'
```

## 🚀 Deployment

### Deploy Backend (Heroku, Railway, Render)
1. Ensure all environment variables are set
2. Create a `Procfile` with: `web: node server.js`
3. Set `NODE_ENV=production`
4. Push to hosting platform

### Deploy Frontend (Vercel, Netlify)
1. Build the React app: `npm run build`
2. Deploy the `build` folder
3. Update `REACT_APP_API_URL` to your deployed backend URL

## 📧 Support & Contact

For issues or questions, please create an issue in the repository or contact the development team.

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## ✨ Future Enhancements

- [ ] Task categories/tags
- [ ] Task notes/comments
- [ ] Email notifications
- [ ] Task priorities
- [ ] Recurring tasks
- [ ] Task attachments
- [ ] User profile customization
- [ ] Dark mode
- [ ] Mobile app
- [ ] Real-time notifications (Socket.io)

---

**Happy Task Managing! 🎯**
