# MedCheck - Medical Symptom Checker Application

A comprehensive full-stack application that helps users check their symptoms and connect with medical professionals. MedCheck provides a user-friendly interface for symptom analysis with backend support for authentication and user management.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Project Workflow](#project-workflow)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Development Guidelines](#development-guidelines)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**MedCheck** is a medical symptom checking platform that serves three main user types:
- **Patients**: Check symptoms, view recommendations, connect with doctors
- **Doctors**: View patient cases, provide consultations and recommendations
- **Admins**: Manage platform, users, and system settings

The application is built with a modern tech stack using React for the frontend and Node.js/Express for the backend, with MongoDB as the database.

---

## 🛠 Tech Stack

### **Frontend**
- **Framework**: React 18.3.1
- **Styling**: Tailwind CSS 3.4.19
- **HTTP Client**: Axios 1.16.1
- **Routing**: React Router DOM 7.15.1
- **Testing**: React Testing Library 16.3.2
- **Build Tool**: Create React App (react-scripts 5.0.1)

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB with Mongoose 9.6.2
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Password Hashing**: bcryptjs 3.0.3
- **Utilities**: dotenv, cors, cookie-parser
- **Dev Tool**: nodemon 3.1.14

### **Database**
- **MongoDB**: Cloud-hosted (MongoDB Atlas)
- **Mongoose**: ODM for schema management

---

## 📁 Project Structure

```
MedCheck/
├── backend/                    # Express.js server
│   ├── config/                # Database and app configuration
│   │   └── db.js             # MongoDB connection setup
│   ├── controllers/            # Business logic
│   ├── middleware/             # Custom middleware (auth, validation, etc.)
│   ├── models/                 # Mongoose schemas
│   │   └── User.js            # User model with roles (patient, doctor, admin)
│   ├── routes/                 # API endpoints
│   │   └── authRoutes.js      # Authentication routes
│   ├── utils/                  # Helper functions
│   ├── server.js              # Main server entry point
│   ├── package.json           # Dependencies and scripts
│   ├── .env                   # Environment variables
│   └── .gitignore
│
├── frontend/                   # React application
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── api/               # API service calls
│   │   ├── assets/            # Images, icons, fonts
│   │   ├── components/        # Reusable React components
│   │   ├── context/           # React Context for state management
│   │   ├── hooks/             # Custom React hooks
│   │   ├── layouts/           # Layout components
│   │   ├── pages/             # Page components
│   │   ├── routes/            # Route configuration
│   │   ├── services/          # Business logic services
│   │   ├── utils/             # Utility functions
│   │   ├── App.jsx            # Main app component
│   │   ├── index.js           # Entry point
│   │   └── index.css          # Global styles
│   ├── package.json           # Dependencies and scripts
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   ├── postcss.config.js      # PostCSS configuration
│   └── .gitignore
│
├── .git/                      # Git repository
├── .gitignore                 # Global gitignore
└── README.md                  # This file

```

---

## ✨ Features

### **User Authentication**
- User registration with validation
- Secure login with JWT tokens
- Password encryption using bcryptjs
- Cookie-based session management
- Email validation

### **User Roles & Access Control**
- **Patient**: Symptom checking, doctor consultations, medical history
- **Doctor**: Patient case management, consultation services, specialty-based profiles
- **Admin**: User management, platform administration

### **Patient Features**
- Symptom checker interface
- Medical history tracking
- Doctor recommendation engine
- Appointment booking (planned)
- Health reports

### **Doctor Features**
- Patient case dashboard
- Consultation management
- Specialty profile setup
- License verification
- Rating system

### **Backend Features**
- RESTful API architecture
- CORS enabled for cross-origin requests
- Comprehensive error handling
- Input validation and sanitization
- Health check endpoint

---

## 📦 Prerequisites

Before setting up the project, ensure you have:

- **Node.js** (v14 or higher) and **npm** (v6 or higher)
- **MongoDB Atlas** account (or local MongoDB installation)
- **Git** for version control
- **Code Editor** (VS Code recommended)
- **Postman** or **Insomnia** (optional, for API testing)

---

## 🚀 Installation & Setup

### **1. Clone the Repository**

```bash
git clone https://github.com/Virangi06/MedCheck.git
cd MedCheck
```

### **2. Backend Setup**

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create/update .env file with configuration (see Environment Variables section)
# Edit .env with your MongoDB URI and other settings

# Verify database connection
npm run dev
```

### **3. Frontend Setup**

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build Tailwind CSS (if needed)
npm run build

# Start the development server
npm start
```

The application will open at `http://localhost:3000` with the backend running on `http://localhost:5000`.

---

## 🔄 Project Workflow

### **Development Workflow**

1. **Feature Branch Creation**
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Development Phase**
   - Make changes in frontend and/or backend
   - Test locally using `npm run dev` (backend) and `npm start` (frontend)
   - Ensure code follows project conventions

3. **Testing**
   - Frontend: `npm test`
   - Backend: (test setup to be configured)
   - Manual testing using Postman/browser

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "descriptive commit message"
   ```

5. **Push & Create Pull Request**
   ```bash
   git push origin feature/feature-name
   ```

### **Deployment Workflow**

1. Test all features in development environment
2. Create and review pull requests
3. Merge to main branch after approval
4. Deploy to production environment

---

## ▶️ Running the Application

### **Backend Server**

**Development Mode** (with auto-reload):
```bash
cd backend
npm run dev
```

**Production Mode**:
```bash
cd backend
npm start
```

The backend will start on the port specified in `.env` (default: `5000`)

Health Check:
```bash
curl http://localhost:5000/api/health
```

### **Frontend Application**

**Development Mode** (with hot reload):
```bash
cd frontend
npm start
```

**Production Build**:
```bash
cd frontend
npm run build
```

The frontend will open at `http://localhost:3000`

### **Running Both Servers Simultaneously**

Open two terminal windows/tabs:
- **Terminal 1**: `cd backend && npm run dev`
- **Terminal 2**: `cd frontend && npm start`

---

## 📡 API Documentation

### **Base URL**
```
http://localhost:5000/api
```

### **Authentication Routes** (`/api/auth`)

#### **Register User**
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "patient" | "doctor" | "admin"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "user": { ... },
  "token": "jwt_token_here"
}
```

#### **Login User**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "user": { ... },
  "token": "jwt_token_here"
}
```

#### **Health Check**
```
GET /api/health

Response (200):
{
  "success": true,
  "message": "MedCheck API is running"
}
```

---

## 🗄️ Database Schema

### **User Model**

```javascript
{
  _id: ObjectId,
  name: String (required, 2-80 chars),
  email: String (required, unique, lowercase),
  password: String (required, hashed, min 6 chars),
  role: String (enum: 'patient', 'doctor', 'admin'),
  
  // Doctor-specific fields
  specialty: String,
  licenseNumber: String,
  
  // Profile information
  avatar: String,
  isEmailVerified: Boolean (default: false),
  isActive: Boolean (default: true),
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- Email field indexed for fast lookups

---

## 🔐 Environment Variables

### **Backend (.env)**

```env
# Server Configuration
PORT=5000

# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Configuration
JWT_SECRET=your_secret_key_here

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000
```

### **Frontend (.env)**

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

**Note**: Never commit `.env` files with sensitive data. Use `.env.example` for documentation.

---

## 💻 Development Guidelines

### **Code Style**
- Use ES6+ syntax
- Follow consistent naming conventions (camelCase for variables/functions)
- Add meaningful comments for complex logic
- Use async/await for asynchronous operations

### **Frontend Best Practices**
- Keep components small and reusable
- Use React hooks for state management
- Utilize Context API for global state
- Implement proper error handling
- Add loading and error states to components

### **Backend Best Practices**
- Validate all user inputs
- Use middleware for common operations
- Implement proper error handling
- Use environment variables for configuration
- Keep routes organized by functionality
- Add logging for debugging

### **Commit Messages**
```
Format: <type>(<scope>): <subject>

Types: feat, fix, docs, style, refactor, test, chore
Example: feat(auth): add JWT token validation
```

### **Testing**

**Frontend**:
```bash
cd frontend
npm test
```

**Backend**: (to be configured)

---

## 🌐 Deployment

### **Backend Deployment** (Node.js/Express)

**Options**:
- Heroku
- AWS (EC2, Elastic Beanstalk)
- DigitalOcean
- Railway
- Vercel (with serverless functions)

**Steps**:
1. Set environment variables on hosting platform
2. Connect GitHub repository
3. Configure deployment settings
4. Deploy main branch

### **Frontend Deployment** (React)

**Options**:
- Vercel (recommended for React)
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- DigitalOcean

**Build & Deploy**:
```bash
cd frontend
npm run build
# Upload 'build' folder to hosting platform
```

### **Database Deployment**
- MongoDB Atlas (recommended, already configured)
- AWS MongoDB (DocumentDB)
- Self-hosted MongoDB server

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🐛 Troubleshooting

### **Backend Issues**

**MongoDB Connection Error**
```
Solution:
1. Verify MONGO_URI in .env
2. Check MongoDB Atlas IP whitelist
3. Ensure database credentials are correct
4. Test connection with: mongosh "mongodb_uri"
```

**Port Already in Use**
```bash
# Change PORT in .env
# Or kill process using port 5000:
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000
```

**CORS Error**
```
Solution:
- Verify CLIENT_URL in backend .env matches frontend URL
- Check CORS middleware configuration in server.js
```

### **Frontend Issues**

**Dependencies Installation Error**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Port 3000 Already in Use**
```bash
# Change port or kill process
export PORT=3001 && npm start
```

**API Connection Error**
```
Solution:
1. Verify backend is running (http://localhost:5000/api/health)
2. Check API_BASE_URL in frontend .env
3. Verify CORS is enabled in backend
```

### **Common Issues**

| Issue | Solution |
|-------|----------|
| "Cannot find module" | Run `npm install` in respective directory |
| JWT token expired | Clear browser localStorage and re-login |
| Email already exists | Use different email for registration |
| Build fails | Clear node_modules, reinstall, and rebuild |

---

## 📞 Support & Contact

For issues or questions:
- Open an issue on GitHub
- Contact: support@medcheck.com
- Documentation: [Project Wiki] (to be added)

---

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- MongoDB & Mongoose for database management
- React for frontend framework
- Express.js for backend framework
- Tailwind CSS for styling

---

**Last Updated**: 2026-05-25

For the latest updates and features, visit: [GitHub Repository](https://github.com/Virangi06/MedCheck)
