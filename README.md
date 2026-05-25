# MedCheck

MedCheck is an AI-powered symptom analysis and health guidance platform built using the MERN stack.

The platform helps users:
- Analyze symptoms
- Receive health insights
- Suggest nearby doctor contacts
- Track symptom history
- Access AI-based recommendations

---

# Tech Stack

## Frontend
- React.js
- Tailwind CSS
- React Router DOM
- Axios

## Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication

---

# Features

- User Authentication
- JWT-Based Login System
- Protected Routes
- Patient Dashboard
- Symptom Analysis System
- Responsive UI
- MongoDB Atlas Integration

---

# Project Structure

```bash
MedCheck/
│
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/MedCheck.git
cd MedCheck
```

---

# Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:3000
```

Run Backend

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on:

```bash
http://localhost:3000
```

---

# API Routes

## Authentication

```bash
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

---

# Future Improvements

- AI Symptom Prediction
- Health Report Generation
- Severity Detection
- Nearby Doctor appointment booking
- AI Chat Assistant

---

# Author

Virangi

GitHub: https://github.com/Virangi06