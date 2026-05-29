# 🩺 MedCheck

MedCheck is a full-stack AI-powered healthcare assistant built with the MERN stack. It helps users analyze symptoms, receive personalized health insights, maintain health records, track medical history, and share feedback about their healthcare experience.

---

## 🚀 Features

### 🔐 Authentication & Security

* User Registration & Login
* JWT-Based Authentication
* Protected Routes
* Secure Password Storage
* Session Management

### 🤖 AI Symptom Analysis

* AI-powered symptom assessment
* Condition prediction and explanation
* Urgency level detection
* Personalized recovery guidance
* Precaution recommendations
* Diet and wellness suggestions
* Medicine recommendations
* Emergency warning alerts

### 👤 Patient Dashboard

* Personalized dashboard
* Analysis history tracking
* Detailed analysis reports
* Expandable medical insights
* Condition timeline
* Health statistics overview

### ❤️ Health Profile Management

* Create and update health profile
* Store age, gender, height, and weight
* Manage existing diseases
* Manage medications
* Record allergies
* Profile editing functionality

### 📍 Healthcare Recommendations

* Nearby healthcare facility suggestions
* Hospital and clinic recommendations
* Distance-based facility listing
* Healthcare provider information

### ⭐ Feedback System

* Submit ratings and reviews
* Manage personal feedback history
* Delete submitted feedback
* Display community testimonials on homepage

### 📊 Health Analytics

* Analysis statistics
* Condition tracking
* Urgency monitoring
* Historical health insights

### 🎨 Modern User Experience

* Responsive design
* Mobile-friendly interface
* Modern healthcare dashboard
* Interactive UI components
* Clean and intuitive navigation

---

## 🛠 Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Lucide React
* CSS3
* Responsive Design

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcrypt.js
* REST APIs

### Database

* MongoDB Atlas
* Mongoose ODM

### AI Integration

* Groq API
* AI-powered symptom analysis

---

## 📂 Project Structure

```bash
MedCheck/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── context/
│   │   └── assets/
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/MedCheck.git
cd MedCheck
```

---

## 🔧 Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret_key

GROQ_API_KEY=your_groq_api_key

CLIENT_URL=http://localhost:3000
```

Run backend:

```bash
npm run dev
```

Backend Server:

```bash
http://localhost:5000
```

---

## 🎨 Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend Application:

```bash
http://localhost:3000
```

---

## 🔗 API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Profile

```http
GET    /api/profile
PUT    /api/profile
```

### Symptom Analysis

```http
POST /api/analysis/analyze
GET  /api/analysis/history
```

### Feedback

```http
POST   /api/feedback/create
GET    /api/feedback/my-feedbacks
GET    /api/feedback/random/:limit
DELETE /api/feedback/delete/:id
```

---

## 📸 Core Modules

* Authentication System
* AI Symptom Checker
* Patient Dashboard
* Health Profile Management
* Analysis History
* Feedback & Ratings
* Nearby Healthcare Recommendations
* Emergency Detection System

---

## 🔮 Future Enhancements

* Appointment Booking System
* Doctor Dashboard
* Multi-language Support
* Health Trends & Analytics

---

## 👨‍💻 Author

**Virangi**

GitHub: https://github.com/Virangi06

---

## ⭐ Support

If you found this project useful, consider giving it a star on GitHub.
