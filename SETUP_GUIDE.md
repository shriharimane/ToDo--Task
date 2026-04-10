# 🚀 Quick Start Guide - Task Management System

## Prerequisites
- **Node.js** v14 or higher
- **MongoDB** (Local or Atlas Cloud)
- **npm** or **yarn**
- **Git** (for version control)

## ⚡ Quick Setup (5 Minutes)

### Step 1: Navigate to Project Directory
```bash
cd "C:\Users\priya\OneDrive\Desktop\ace\ToDo--Task"
```

### Step 2: Install Dependencies
```bash
# Install root dependencies
npm install concurrently

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Step 3: Configure MongoDB

#### Option A: Local MongoDB (Windows)
1. Download MongoDB Community Edition
2. Install with default settings
3. Start MongoDB:
   ```bash
   mongod
   ```

#### Option B: MongoDB Atlas (Recommended for Production)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update `server/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-management?retryWrites=true&w=majority
   ```

### Step 4: Start the Application

#### Option A: Run Both Together (Easiest)
```bash
# From root directory
npm start
```

#### Option B: Run Separately
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend (new terminal)
cd client
npm start
```

### Step 5: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

## 🔐 Demo Login

Use these credentials to test the app immediately:

### User 1 - John
```
Email: john@example.com
Password: password123
```

### User 2 - Jane
```
Email: jane@example.com
Password: password456
```

**First Time Setup**: Register new users or use the credentials above if database is seeded.

## 📁 Project Structure Quick Reference

```
task-management-system/
├── server/                 ← Backend (Node.js + Express)
│   ├── config/            ← Database config
│   ├── controllers/       ← Business logic
│   ├── middleware/        ← Auth & error handling
│   ├── models/            ← Database schemas
│   ├── routes/            ← API endpoints
│   ├── utils/             ← Utilities & helpers
│   └── server.js          ← Entry point
│
├── client/                 ← Frontend (React)
│   ├── public/            ← Static files
│   ├── src/
│   │   ├── components/    ← React components
│   │   ├── pages/         ← Page components
│   │   ├── services/      ← API calls
│   │   ├── context/       ← State management
│   │   ├── styles/        ← CSS files
│   │   └── App.js         ← Root component
│   └── package.json
│
├── package.json           ← Root package.json
└── README.md             ← Full documentation
```

## 🎯 Key Features

✅ **User Authentication**: Register & Login with JWT  
✅ **Personal Tasks**: Private tasks visible only to creator  
✅ **Assigned Tasks**: Share tasks with specific users  
✅ **Role-Based Access**: Assignee can only update status  
✅ **Task Filtering**: Filter by Todo, In Progress, Done  
✅ **Responsive UI**: Works on desktop and mobile  
✅ **Error Handling**: User-friendly error messages  

## 🔧 Troubleshooting

### MongoDB Connection Failed
```
Error: connect ECONNREFUSED
```
**Solution**: Make sure MongoDB is running
```bash
mongod  # Start MongoDB
```

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution**: Change PORT in `server/.env` or kill the process

### Module Not Found
```
Cannot find module 'express'
```
**Solution**: Run `npm install` in server or client directory

### React App Not Loading
- Clear browser cache: `Ctrl + Shift + Delete`
- Restart dev server: `Ctrl + C` then `npm start` again
- Check console errors: `F12`

## 📝 Important Files

| File | Purpose |
|------|---------|
| `server/.env` | Backend environment variables |
| `server/server.js` | Backend entry point |
| `server/config/database.js` | MongoDB connection |
| `client/src/App.js` | React root component |
| `client/src/services/` | API calls |
| `README.md` | Full documentation |

## 🌐 API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile

POST   /api/tasks
GET    /api/tasks
GET    /api/tasks/:id
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
GET    /api/tasks/users
```

## 📚 Testing the API (Using Postman or cURL)

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"password123","confirmPassword":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## 🆘 Need Help?

1. Check `README.md` for detailed documentation
2. Review the code comments in files
3. Check browser console for errors (F12)
4. Check server logs in terminal
5. Create an issue with details if stuck

## ✨ Next Steps

1. **Customize**: Update colors, fonts in `client/src/styles/index.css`
2. **Add Features**: Implement new task fields or filters
3. **Deploy**: Push to GitHub, host on Heroku/Vercel
4. **Database**: Switch to MongoDB Atlas for production

---

**Happy coding! 🎉**
