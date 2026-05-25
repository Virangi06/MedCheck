# Backend Integration Plan for MedCheck

## 🚀 Overview

This document outlines the complete backend architecture and integration strategy for transforming MedCheck from a frontend-only application to a full-stack healthcare platform.

---

## 📋 Phase 1: Backend Setup & API Architecture

### **1.1 Technology Stack Recommendation**

**Backend Framework**: Node.js + Express.js
```bash
npm install express dotenv cors multer axios
```

**Database**: MongoDB (NoSQL - flexible schema for varied patient data)
```bash
npm install mongoose
```

**Authentication**: JWT (JSON Web Tokens)
```bash
npm install jsonwebtoken bcryptjs
```

**Additional Libraries**:
- `validator`: Email and data validation
- `express-validator`: Middleware validation
- `nodemailer`: Email notifications
- `stripe`: Payment processing
- `axios`: Third-party API calls (AI, email services)

### **1.2 Project Structure**

```
backend/
├── config/
│   ├── database.js          # MongoDB connection
│   ├── environment.js       # Environment variables
│   └── constants.js         # App constants
├── models/
│   ├── User.js              # User schema
│   ├── Doctor.js            # Doctor schema
│   ├── Patient.js           # Patient schema
│   ├── Appointment.js       # Appointment schema
│   ├── Symptom.js           # Symptom history
│   └── AnalysisResult.js    # Analysis records
├── controllers/
│   ├── authController.js    # Auth operations
│   ├── userController.js    # User management
│   ├── doctorController.js  # Doctor operations
│   ├── appointmentController.js
│   ├── symptomController.js # Analysis
│   └── paymentController.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── doctors.js
│   ├── appointments.js
│   ├── symptoms.js
│   └── payments.js
├── middleware/
│   ├── auth.js              # JWT verification
│   ├── errorHandler.js
│   ├── validation.js
│   └── logging.js
├── services/
│   ├── aiService.js         # AI integration (Google Gemini)
│   ├── emailService.js      # Email notifications
│   ├── paymentService.js    # Stripe integration
│   └── appointmentService.js
├── utils/
│   ├── validators.js
│   ├── responses.js         # Standard responses
│   └── helpers.js
├── .env                     # Environment variables
├── .gitignore
└── server.js                # Entry point
```

---

## 📦 Phase 2: Database Models & Schema

### **2.1 User Model** (Base for authentication)

```javascript
// models/User.js
const userSchema = {
  id: ObjectId,
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false  // Don't return password by default
  },
  name: String,
  phone: String,
  role: {
    type: String,
    enum: ['patient', 'doctor'],
    required: true
  },
  profilePicture: String,
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: Date,
  updatedAt: Date
}
```

### **2.2 Patient Model**

```javascript
// models/Patient.js
const patientSchema = {
  userId: ObjectId,  // Reference to User
  dateOfBirth: Date,
  gender: String,
  medicalHistory: [String],
  allergies: [String],
  currentMedications: [String],
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  appointments: [ObjectId],  // References to Appointments
  analysisHistory: [ObjectId],  // References to AnalysisResults
  preferences: {
    consultationType: String,
    language: String,
    notifications: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### **2.3 Doctor Model**

```javascript
// models/Doctor.js
const doctorSchema = {
  userId: ObjectId,  // Reference to User
  licenseNumber: {
    type: String,
    unique: true,
    required: true
  },
  specialties: [String],  // e.g., ['General Practitioner', 'ENT']
  qualifications: [String],  // e.g., ['MD', 'Board Certified']
  bio: String,
  experience: Number,  // Years of experience
  clinicAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  consultationFee: Number,  // In dollars
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [
    {
      patientId: ObjectId,
      rating: Number,
      comment: String,
      createdAt: Date
    }
  ],
  availability: [
    {
      dayOfWeek: String,  // 'Monday', 'Tuesday', etc.
      startTime: String,  // '09:00'
      endTime: String,    // '17:00'
      slotDuration: Number  // Minutes
    }
  ],
  appointments: [ObjectId],
  verified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### **2.4 Appointment Model**

```javascript
// models/Appointment.js
const appointmentSchema = {
  id: ObjectId,
  patientId: ObjectId,  // Reference to Patient
  doctorId: ObjectId,   // Reference to Doctor
  scheduledDate: Date,
  startTime: String,
  endTime: String,
  type: {
    type: String,
    enum: ['video', 'in-person', 'phone'],
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  notes: String,
  symptomAnalysisId: ObjectId,  // Link to analysis
  prescription: String,  // Doctor's notes/prescription
  followUpScheduled: Boolean,
  meetingLink: String,  // For video consultations
  cost: Number,
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'refunded'],
    default: 'pending'
  },
  createdAt: Date,
  updatedAt: Date
}
```

### **2.5 Symptom Analysis Result Model**

```javascript
// models/AnalysisResult.js
const analysisSchema = {
  id: ObjectId,
  patientId: ObjectId,
  inputSymptoms: {
    mainSymptom: String,
    associatedSymptoms: [String],
    duration: String,
    severity: String,
    additionalInfo: String
  },
  analysisResult: {
    possibleConditions: [
      {
        name: String,
        probability: Number,
        description: String,
        severity: String
      }
    ],
    urgencyLevel: {
      type: String,
      enum: ['low', 'moderate', 'high']
    },
    recommendedSpecialists: [String],
    recommendations: [String],
    disclaimer: String
  },
  aiModel: String,  // Which AI model was used
  confidenceScore: Number,
  appointmentScheduled: Boolean,
  appointmentId: ObjectId,
  createdAt: Date
}
```

---

## 🔐 Phase 3: Authentication & User Management

### **3.1 JWT Authentication Flow**

```javascript
// routes/auth.js

POST /api/auth/register
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "patient"
}

Response (201):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}

---

POST /api/auth/login
Request:
{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {...}
}

---

POST /api/auth/logout
Headers: { Authorization: "Bearer <token>" }

Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

### **3.2 Protected Route Middleware**

```javascript
// middleware/auth.js

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ error: 'Unauthorized role' });
    }
    next();
  };
};

// Usage in routes:
app.post('/api/appointments/book', verifyToken, verifyRole(['patient']), bookAppointment);
```

---

## 🩺 Phase 4: Core API Endpoints

### **4.1 Symptom Analysis Endpoints**

```javascript
POST /api/symptoms/analyze
Headers: { Authorization: "Bearer <token>" }
Body:
{
  "mainSymptom": "fever",
  "associatedSymptoms": ["headache", "body aches"],
  "duration": "1-3-days",
  "severity": "moderate",
  "additionalInfo": "Started after exposure to sick colleague"
}

Response (200):
{
  "analysisId": "507f1f77bcf86cd799439011",
  "inputData": {...},
  "analysisResult": {
    "possibleConditions": [
      {
        "name": "Common Cold",
        "probability": 75,
        "description": "Viral respiratory infection...",
        "severity": "low"
      },
      ...
    ],
    "urgencyLevel": "moderate",
    "recommendedSpecialists": ["General Practitioner", "ENT Specialist"],
    "recommendations": [
      "Rest and hydration",
      "Monitor temperature",
      "Schedule doctor visit within 2-3 days"
    ]
  },
  "createdAt": "2026-05-24T10:30:00Z"
}

---

GET /api/symptoms/history
Headers: { Authorization: "Bearer <token>" }

Response (200):
{
  "analyses": [
    {
      "id": "...",
      "mainSymptom": "fever",
      "analysisDate": "2026-05-24",
      "urgencyLevel": "moderate",
      "appointmentScheduled": true
    },
    ...
  ]
}

---

GET /api/symptoms/:analysisId
Headers: { Authorization: "Bearer <token>" }

Response (200): Full analysis detail
```

### **4.2 Doctor Management Endpoints**

```javascript
GET /api/doctors
Query params:
  - specialty: "General Practitioner"
  - city: "New York"
  - minRating: 4.5
  - page: 1
  - limit: 10

Response (200):
{
  "totalCount": 42,
  "page": 1,
  "limit": 10,
  "doctors": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Dr. Sarah Johnson",
      "specialty": "General Practitioner",
      "rating": 4.8,
      "reviewCount": 245,
      "experience": 15,
      "city": "New York",
      "consultationFee": 50,
      "bio": "Board-certified GP...",
      "availability": [...]
    },
    ...
  ]
}

---

GET /api/doctors/:doctorId
Response (200): Detailed doctor profile including availability and reviews

---

GET /api/doctors/:doctorId/availability
Query: { date: "2026-05-24" }

Response (200):
{
  "doctorId": "...",
  "date": "2026-05-24",
  "availableSlots": [
    "09:00", "10:00", "14:00", "15:30"
  ]
}

---

POST /api/doctors/:doctorId/review
Headers: { Authorization: "Bearer <token>" }
Body:
{
  "rating": 5,
  "comment": "Excellent doctor, very knowledgeable"
}

Response (201): Review created
```

### **4.3 Appointment Endpoints**

```javascript
POST /api/appointments/book
Headers: { Authorization: "Bearer <token>" }
Body:
{
  "doctorId": "507f1f77bcf86cd799439011",
  "date": "2026-05-24",
  "time": "14:00",
  "type": "video",
  "notes": "Have been feeling feverish for 3 days",
  "symptomAnalysisId": "507f1f77bcf86cd799439010"
}

Response (201):
{
  "appointmentId": "507f1f77bcf86cd799439012",
  "status": "confirmed",
  "doctor": {...},
  "scheduledDate": "2026-05-24",
  "startTime": "14:00",
  "type": "video",
  "meetingLink": "https://zoom.us/...",
  "cost": 50,
  "paymentStatus": "pending"
}

---

GET /api/appointments
Headers: { Authorization: "Bearer <token>" }
Query: { status: "upcoming" }

Response (200):
{
  "appointments": [
    {
      "id": "...",
      "doctor": {...},
      "date": "2026-05-24",
      "time": "14:00",
      "status": "confirmed",
      "type": "video"
    },
    ...
  ]
}

---

GET /api/appointments/:appointmentId
Response (200): Full appointment details

---

PUT /api/appointments/:appointmentId
Body: { status: "cancelled" } or { status: "completed" }

---

POST /api/appointments/:appointmentId/reschedule
Body:
{
  "date": "2026-05-26",
  "time": "10:00"
}

---

POST /api/appointments/:appointmentId/complete
Headers: { Authorization: "Bearer <token>" }
Body:
{
  "notes": "Patient shows signs of flu, prescribed...",
  "prescription": "..."
}
```

### **4.4 User Profile Endpoints**

```javascript
GET /api/users/profile
Headers: { Authorization: "Bearer <token>" }

Response (200):
{
  "id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "role": "patient",
  "dateOfBirth": "1990-01-15",
  "medicalHistory": ["Hypertension"],
  "allergies": ["Penicillin"]
}

---

PUT /api/users/profile
Headers: { Authorization: "Bearer <token>" }
Body: { Updates to profile }

---

PUT /api/users/change-password
Headers: { Authorization: "Bearer <token>" }
Body:
{
  "currentPassword": "...",
  "newPassword": "..."
}
```

---

## 🤖 Phase 5: AI Integration (Google Gemini)

### **5.1 Gemini API Integration**

```bash
npm install @google/generative-ai
```

### **5.2 Symptom Analysis Service**

```javascript
// services/aiService.js

const { GoogleGenerativeAI } = require("@google/generative-ai");

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async analyzeSymptomsWithGemini(symptoms, duration, severity) {
    const prompt = `
    As a medical AI assistant, analyze the following symptoms and provide a professional medical assessment:
    
    Main Symptom: ${symptoms.mainSymptom}
    Associated Symptoms: ${symptoms.associatedSymptoms.join(', ')}
    Duration: ${duration}
    Severity: ${severity}
    
    Please provide:
    1. Top 5 possible conditions ranked by probability (0-100%)
    2. Urgency level (low/moderate/high)
    3. Recommended specialists
    4. Self-care recommendations
    5. When to seek emergency care
    
    Format response as JSON with keys: 
    conditions (array with name, probability, description), 
    urgencyLevel, 
    recommendedSpecialists (array),
    recommendations (array)
    
    IMPORTANT: Include a medical disclaimer that this is not a substitute for professional diagnosis.
    `;

    const result = await this.model.generateContent(prompt);
    return JSON.parse(result.response.text());
  }

  async getDoctorRecommendation(specialty) {
    const prompt = `
    Provide a brief, professional description of when a patient should see a ${specialty}.
    Keep it under 100 words and informative.
    `;

    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }
}

module.exports = new AIService();
```

### **5.3 Usage in Controller**

```javascript
// controllers/symptomController.js

const aiService = require('../services/aiService');

exports.analyzeSymptoms = async (req, res) => {
  try {
    const { mainSymptom, associatedSymptoms, duration, severity } = req.body;
    
    // Get AI analysis
    const analysis = await aiService.analyzeSymptomsWithGemini(
      { mainSymptom, associatedSymptoms },
      duration,
      severity
    );

    // Save to database
    const result = await AnalysisResult.create({
      patientId: req.userId,
      inputSymptoms: { mainSymptom, associatedSymptoms, duration, severity },
      analysisResult: analysis,
      aiModel: 'gemini-pro',
      confidenceScore: analysis.confidenceScore || 0.85
    });

    res.status(201).json({
      success: true,
      analysisId: result._id,
      analysis
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

---

## 💳 Phase 6: Payment Integration (Stripe)

### **6.1 Stripe Setup**

```bash
npm install stripe
```

### **6.2 Payment Service**

```javascript
// services/paymentService.js

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class PaymentService {
  async createPaymentIntent(amount, appointmentId) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,  // Convert to cents
      currency: 'usd',
      metadata: { appointmentId }
    });

    return {
      clientSecret: paymentIntent.client_secret,
      publicKey: process.env.STRIPE_PUBLIC_KEY
    };
  }

  async confirmPayment(paymentIntentId) {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent.status === 'succeeded';
  }

  async refundPayment(appointmentId) {
    // Retrieve and refund
    const payment = await Payment.findOne({ appointmentId });
    if (payment) {
      await stripe.paymentIntents.cancel(payment.paymentIntentId);
      return true;
    }
    return false;
  }
}

module.exports = new PaymentService();
```

### **6.3 Payment Endpoints**

```javascript
POST /api/payments/create-intent
Headers: { Authorization: "Bearer <token>" }
Body:
{
  "appointmentId": "...",
  "amount": 50
}

Response (201):
{
  "clientSecret": "pi_..._secret_...",
  "publicKey": "pk_test_..."
}

---

POST /api/payments/confirm
Headers: { Authorization: "Bearer <token>" }
Body:
{
  "paymentIntentId": "pi_...",
  "appointmentId": "..."
}

Response (200):
{
  "success": true,
  "appointmentId": "...",
  "paymentStatus": "completed"
}
```

---

## 📧 Phase 7: Email Notifications

### **7.1 Nodemailer Setup**

```javascript
// services/emailService.js

const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendAppointmentConfirmation(patient, doctor, appointment) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: patient.email,
      subject: 'Appointment Confirmed - MedCheck',
      html: `
        <h2>Appointment Confirmation</h2>
        <p>Dear ${patient.name},</p>
        <p>Your appointment with ${doctor.name} has been confirmed.</p>
        <ul>
          <li><strong>Date:</strong> ${appointment.date}</li>
          <li><strong>Time:</strong> ${appointment.time}</li>
          <li><strong>Type:</strong> ${appointment.type}</li>
          ${appointment.meetingLink ? `<li><strong>Meeting Link:</strong> <a href="${appointment.meetingLink}">Join Now</a></li>` : ''}
        </ul>
        <p>Best regards,<br>MedCheck Team</p>
      `
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendAppointmentReminder(patient, appointment) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: patient.email,
      subject: 'Appointment Reminder - MedCheck',
      html: `
        <h2>Appointment Reminder</h2>
        <p>Your appointment is scheduled for ${appointment.date} at ${appointment.time}.</p>
      `
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendAnalysisReport(patient, analysis) {
    // Send symptom analysis result to patient email
  }
}

module.exports = new EmailService();
```

### **7.2 Email Triggers**

- Appointment confirmation
- 24-hour before appointment reminder
- Analysis report delivery
- Password reset
- Profile verification

---

## 🔄 Phase 8: Frontend Integration Updates

### **8.1 API Configuration**

```javascript
// frontend/src/config/api.js

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

### **8.2 Updated Login Component**

```javascript
// frontend/src/pages/Login.jsx (Updated)

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await apiClient.post('/auth/login', {
      email: form.email,
      password: form.password
    });

    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    navigate(user.role === 'doctor' ? '/doctor/dashboard' : '/symptom-checker');
  } catch (error) {
    setErrors({ email: error.response?.data?.message || 'Login failed' });
  } finally {
    setLoading(false);
  }
};
```

### **8.3 Updated Symptom Analysis**

```javascript
// frontend/src/pages/SymptomChecker.jsx (Updated)

const handleAnalyze = async () => {
  setLoading(true);
  try {
    const response = await apiClient.post('/symptoms/analyze', {
      mainSymptom: symptoms,
      associatedSymptoms: otherSymptoms,
      duration,
      severity
    });

    navigate('/results', { state: response.data.analysis });
  } catch (error) {
    alert('Error analyzing symptoms');
  } finally {
    setLoading(false);
  }
};
```

---

## 🗂️ Environment Variables (.env)

```
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/medcheck

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

---

## 📊 Deployment Guide

### **7.1 Backend Deployment (Heroku/Railway)**

```bash
# Create Procfile
echo "web: node server.js" > Procfile

# Deploy to Heroku
heroku create medcheck-backend
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret
heroku push heroku main
```

### **7.2 Frontend Deployment (Vercel/Netlify)**

```bash
# Update .env for production
REACT_APP_API_URL=https://medcheck-backend.herokuapp.com/api

# Deploy
npm run build
# Deploy to Vercel or Netlify
```

---

## 🧪 Testing Strategy

### **API Testing** (Postman/Insomnia):
1. Test all endpoints with valid data
2. Test validation with invalid data
3. Test authentication and authorization
4. Test error handling

### **Frontend Testing**:
```bash
npm install --save-dev @testing-library/react jest
npm test
```

---

## 🔐 Security Checklist

- ✅ Use HTTPS in production
- ✅ Hash passwords with bcrypt
- ✅ Implement rate limiting
- ✅ Validate all inputs
- ✅ Use CORS properly
- ✅ Implement refresh token rotation
- ✅ Add API key validation
- ✅ Protect sensitive data in .env
- ✅ Implement request logging
- ✅ Regular security audits

---

## 📈 Scalability Recommendations

1. **Database**: Use MongoDB Atlas for cloud hosting
2. **Caching**: Implement Redis for session and frequently accessed data
3. **CDN**: Use CloudFlare for static assets
4. **Load Balancing**: Use AWS Load Balancer or similar
5. **Microservices**: Consider splitting AI and payment services
6. **Message Queue**: Use RabbitMQ for async tasks (emails, notifications)

---

## 🎯 Implementation Timeline

- **Week 1-2**: Database setup, user models, authentication
- **Week 3**: Core API endpoints, appointment system
- **Week 4**: Gemini AI integration
- **Week 5**: Payment integration, email service
- **Week 6-7**: Frontend integration, testing
- **Week 8**: Deployment, optimization, security audit

---

## 📞 Support & Maintenance

- Monitor API performance with tools like NewRelic
- Set up error tracking with Sentry
- Implement automated backups for MongoDB
- Regular security updates for dependencies
- Performance optimization based on metrics

