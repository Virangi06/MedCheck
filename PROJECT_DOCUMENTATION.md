# MedCheck - Complete Project Documentation

## Project Overview
**MedCheck** is a MERN-stack healthcare application that provides AI-powered symptom analysis, personalized doctor recommendations based on location, health profile management, and community feedback features.

---

## 🎯 CORE FUNCTIONALITIES

### 1. **USER AUTHENTICATION SYSTEM**
**Module**: Authentication (Login, Register, Password Reset)

**Functionalities:**
- **User Registration** - Create new account with name, email, password
- **User Login** - Authenticate with email/password, receive JWT token
- **Email Verification via OTP** - 6-digit OTP sent to email for password reset
- **Password Reset** - Change forgotten password through OTP verification
- **Role-Based Access Control** - Different roles: Patient, Doctor, Admin (future)
- **Token Management** - JWT tokens stored in localStorage, 7-day expiry
- **Protected Routes** - Unauthorized users redirected to login

**Files Involved:**
- Frontend: `Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`, `VerifyOtp.jsx`, `ResetPassword.jsx`
- Backend: `authController.js`, `authRoutes.js`
- Database: `User.js` model
- Middleware: `authMiddleware.js` (JWT verification)

---

### 2. **AI-POWERED SYMPTOM ANALYSIS**
**Module**: Symptom Checker & Analysis

**Functionalities:**
- **Multi-Step Form** - 2-step form to collect patient information
- **Step 1: Health Profile Collection**
  - Age, Gender, Height, Weight
  - Existing diseases/conditions
  - Current medications
  - Known allergies
- **Step 2: Symptom Details**
  - Symptom description
  - Duration of symptoms
  - Severity level (Mild/Moderate/Severe)
  - Affected body area
- **GPS Location Integration** - Automatically captures user's coordinates
- **Profile Auto-Fill** - Previously saved profile automatically fills in the form
- **AI Analysis via Groq API** - Processes patient data through Llama 3.3 70B model
- **Analysis Results Include:**
  - Possible medical condition
  - Condition explanation
  - Urgency level (Low/Moderate/High/Emergency)
  - Recommended doctor type
  - Recommended specialist
  - Home care precautions (bullet list)
  - Suggested medications (bullet list)
  - Nutritional recommendations
  - Recovery advice
  - When to see a doctor
  - Emergency warnings (if applicable)

**Files Involved:**
- Frontend: `SymptomChecker.jsx`, `Results.jsx`
- Backend: `analysisController.js`, `aiService.js`, `analysisRoutes.js`
- Database: `Analysis.js` model
- External API: Groq Cloud (AI inference)

---

### 3. **HEALTH PROFILE MANAGEMENT**
**Module**: Patient Health Profile

**Functionalities:**
- **Create Health Profile** - Initialize empty profile on first login
- **Update Health Profile** - Store permanent health information
- **Auto-Fill Form** - Profile data automatically fills symptom checker form
- **Edit Profile** - Update profile information anytime
- **Persistent Storage** - Health info stored in MongoDB for future reference
- **Profile Fields:**
  - Full Name
  - Age
  - Gender
  - Height (cm)
  - Weight (kg)
  - Existing Diseases
  - Current Medications
  - Known Allergies

**Files Involved:**
- Frontend: `SymptomChecker.jsx`, `PatientDashboard.jsx`
- Backend: `profileController.js`, `profileRoutes.js`
- Database: `UserProfile.js` model (one-to-one with User)

---

### 4. **NEARBY DOCTOR RECOMMENDATIONS**
**Module**: Geolocation-Based Facility Search

**Functionalities:**
- **Location-Based Search** - Find medical facilities within 5km radius
- **Facility Types Found:**
  - Hospitals
  - Clinics
  - Doctors offices
  - Pharmacies
- **Facility Information Displayed:**
  - Facility name
  - Type/category
  - Full address
  - Distance in kilometers
  - Contact phone number
  - GPS coordinates (latitude, longitude)
- **Distance Calculation** - Haversine formula to calculate accurate distances
- **Sorted by Distance** - Facilities sorted from closest to farthest
- **Maximum 5 Facilities** - Shows top 5 nearest facilities
- **Fallback Mock Data** - Provides sample data if API unavailable
- **Real-Time Search** - Uses OpenStreetMap data via Overpass API

**Files Involved:**
- Frontend: `Results.jsx`, `PatientDashboard.jsx`
- Backend: `locationService.js`, `calculateDistance.js`
- External API: Overpass API (OpenStreetMap data)

---

### 5. **ANALYSIS HISTORY TRACKING**
**Module**: Dashboard & Health Records

**Functionalities:**
- **View All Analyses** - See complete history of all symptom checks
- **Collapsible Details** - Expand each analysis to view full details
- **Analysis Cards Show:**
  - Detected condition
  - Urgency level with color coding
  - Reported symptoms
  - Duration and date
  - Quick preview
- **Detailed Analysis View** - Click to expand and see:
  - Complete symptom information
  - Doctor recommendations
  - Precautions and medications
  - Diet recommendations
  - Recovery advice
  - Nearby medical facilities
  - Emergency warnings
- **Download PDF** - Export individual analyses as professional PDF reports
- **Date-Organized** - Analyses sorted by most recent first
- **Search/Filter** - Can view specific past analyses (in dashboard)
- **Persistent Records** - All analyses stored permanently in MongoDB

**Files Involved:**
- Frontend: `PatientDashboard.jsx`
- Backend: `analysisController.js` getHistory()
- Database: `Analysis.js` model with userId reference

---

### 6. **FEEDBACK & TESTIMONIALS SYSTEM**
**Module**: Community Reviews & Ratings

**Functionalities:**
- **Submit Feedback** - Patients/doctors can leave feedback with rating
- **Star Rating** - 1-5 star rating system
- **Feedback Text** - Write feedback (10-500 characters)
- **View Own Feedbacks** - See all feedback submitted by current user
- **Edit Feedback** - Update rating and feedback text
- **Delete Feedback** - Remove feedback from system
- **View All Feedbacks** - See all approved feedbacks from community
- **Random Feedbacks** - Display random testimonials on homepage
- **Verification Badge** - Doctor feedback shows verification status
- **Approval System** - Feedback auto-approved, admin can manage later

**Files Involved:**
- Frontend: `Home.jsx` (testimonials), `PatientDashboard.jsx` (manage feedback)
- Backend: `feedbackController.js`, `feedbackRoutes.js`
- Database: `Feedback.js` model

---

### 7. **PDF REPORT GENERATION**
**Module**: Analysis Report Export

**Functionalities:**
- **Generate Professional PDF** - Convert analysis results to downloadable PDF
- **PDF Content Includes:**
  - MedCheck header with branding
  - Report generation date and time
  - Patient name
  - Patient profile (age, gender, height, weight)
  - Health conditions, medications, allergies
  - Symptom information (symptoms, duration, severity, affected area)
  - Medical analysis results (condition, explanation, urgency)
  - Medical recommendations (doctor type, specialist)
  - Precautions and suggested medications
  - Nutrition and recovery guidance
  - Nearby medical facilities with details
  - Emergency warnings (if applicable)
  - Medical disclaimer footer
- **Automatic File Naming** - Files named as `MedCheck_Analysis_YYYY-MM-DD.pdf`
- **One-Click Download** - Download button on results page
- **Clean Formatting** - Professional layout with proper text wrapping
- **Multi-Page Support** - Automatic page breaks for long content
- **Plain English** - All text in clear, readable English (no special characters)

**Files Involved:**
- Frontend: `utils/generateAnalysisPDF.js`
- Library: jsPDF, html2canvas

---

### 8. **RESPONSIVE USER INTERFACE**
**Module**: Frontend Pages & Components

**Public Pages:**
- **Home** - Landing page with feature highlights and testimonials
- **About** - Company/product information
- **Product Info Pages** - Details about AI analysis, doctor suggestions, health insights, health history
- **Legal Pages** - Privacy policy, terms of service, medical disclaimer, cookie policy
- **Authentication Pages** - Login, Register, Password reset flow

**Protected Pages:**
- **Symptom Checker** - Multi-step symptom analysis form
- **Results** - Display analysis results with nearby doctors
- **Patient Dashboard** - View history, manage profile, feedback system, health statistics

**Reusable Components:**
- Navbar - Navigation with conditional rendering
- Button, Input, Select, Checkbox - Form elements
- Badge - Status indicators
- Card, MedCheckLogo - UI containers
- MedIcon - Icon library wrapper

---

## 🔐 AUTHENTICATION FLOW

```
Registration:
User Input → Frontend Validation → POST /api/auth/register 
→ Backend Validation & Password Hashing → Create User 
→ Generate JWT Token → Return Token & User → Store in localStorage

Login:
Email + Password → POST /api/auth/login 
→ Verify Credentials → Generate JWT → Return Token → localStorage

Protected Routes:
Request → Check Token in localStorage → Add to Authorization Header 
→ authMiddleware Verification → Populate req.user → Process Request

Password Reset:
Forgot Password → POST /api/auth/forgot-password → Generate 6-digit OTP 
→ Send via Email → Verify OTP → POST /api/auth/reset-password 
→ Hash New Password → Delete OTP Records
```

---

## 📊 DATA MODELS

### **User Model**
```
- name (String) - User's full name
- email (String, Unique) - User's email address
- password (String, Hashed) - Bcrypt hashed password
- role (Enum) - Patient/Doctor/Admin
- specialty (String) - For doctors only
- licenseNumber (String) - For verified doctors
- isEmailVerified (Boolean) - Email verification status
- isActive (Boolean) - Account active/inactive
- createdAt, updatedAt (Timestamps)
```

### **UserProfile Model**
```
- user (Reference to User, Unique)
- fullName (String)
- age (Number or String)
- gender (String) - Male/Female/Other
- height (Number) - in cm
- weight (Number) - in kg
- diseases (String) - Existing conditions
- medications (String) - Current medications
- allergies (String) - Known allergies
- createdAt, updatedAt (Timestamps)
```

### **Analysis Model**
```
- user (Reference to User) - Which patient
- inputData (Object) - Patient information provided
- location (Object) - {lat, lng} GPS coordinates
- possibleCondition (String) - Diagnosed condition
- conditionExplanation (String) - Explanation
- urgencyLevel (String) - Low/Moderate/High/Emergency
- recommendedDoctor (String) - Doctor type
- recommendedSpecialist (String) - Specialist type
- precautions (Array) - List of precautions
- recommendedMedicines (Array) - List of medicines
- dietRecommendation (String) - Diet advice
- recoveryAdvice (String) - Recovery guidance
- emergencyWarning (String) - Emergency notice
- whenToSeeDoctor (String) - Consultation timing
- nearbyDoctors (Array) - [{name, type, address, distance, phone}]
- createdAt, updatedAt (Timestamps)
```

### **Feedback Model**
```
- userId (Reference to User)
- userName (String) - User's name
- role (Enum) - Patient/Doctor/Other
- rating (Number) - 1-5 stars
- feedbackText (String) - Feedback content (10-500 chars)
- isVerified (Boolean) - Doctor verification status
- isApproved (Boolean) - Admin approval status
- createdAt, updatedAt (Timestamps)
```

### **OTP Model**
```
- email (String) - User's email
- otp (String) - 6-digit code
- expiresAt (Date) - Expiry time (5 minutes)
```

---

## 🔗 API ENDPOINTS SUMMARY

| Method | Endpoint | Protection | Purpose |
|--------|----------|-----------|---------|
| POST | /api/auth/register | Public | User registration |
| POST | /api/auth/login | Public | User login |
| GET | /api/auth/me | Protected | Get current user |
| POST | /api/auth/forgot-password | Public | Request password reset |
| POST | /api/auth/verify-otp | Public | Verify OTP |
| POST | /api/auth/reset-password | Public | Reset password |
| POST | /api/analysis/analyze | Protected | Submit symptom analysis |
| GET | /api/analysis/history | Protected | Get user's analyses |
| GET | /api/profile | Protected | Get user's profile |
| GET | /api/profile/init | Protected | Initialize profile |
| PUT | /api/profile | Protected | Update profile |
| POST | /api/feedback/create | Protected | Submit feedback |
| GET | /api/feedback/all | Public | View all feedbacks |
| GET | /api/feedback/my-feedbacks | Protected | View user's feedbacks |
| PUT | /api/feedback/update/:id | Protected | Update feedback |
| DELETE | /api/feedback/delete/:id | Protected | Delete feedback |
| GET | /api/feedback/random/:limit | Public | Random feedbacks |
| GET | /api/health | Public | Health check |

---

## 🛠️ EXTERNAL INTEGRATIONS

### **1. Groq AI API**
- **Purpose**: AI-powered symptom analysis
- **Model**: Llama 3.3 70B
- **Input**: Patient health data and symptoms
- **Output**: Medical analysis (condition, recommendations, urgency)
- **Response Time**: ~10-30 seconds

### **2. Overpass API (OpenStreetMap)**
- **Purpose**: Find nearby medical facilities
- **Data Source**: OpenStreetMap community data
- **Radius**: 5km from user location
- **Returns**: Hospitals, clinics, doctors, pharmacies

### **3. Nodemailer (Email)**
- **Purpose**: Send OTP for password reset
- **Email Provider**: Gmail SMTP
- **Content**: 6-digit OTP code
- **Expiry**: 5 minutes

---

## 📱 USER ROLES & PERMISSIONS

### **Patient (Current Implementation)**
- View own profile
- Submit symptom analyses
- View analysis history
- Download reports
- View nearby doctors
- Submit feedback
- Edit own feedback
- View community feedbacks

### **Doctor (Backend Ready, Frontend Future)**
- View own profile
- View patient analyses (with permission)
- Submit verified feedback
- Special badge on testimonials

### **Admin (Future)**
- Manage users
- Approve/reject feedbacks
- View analytics
- System configuration

---

## 🎨 USER INTERFACE FEATURES

**Design System:**
- **Color Scheme**: Blue (#0284c7 primary), Dark gray (#0f172a), Light backgrounds
- **Typography**: DM Sans font family, Syne for headings
- **Layout**: Responsive grid system, mobile-first approach
- **Components**: Cards, badges, buttons, collapsible sections
- **Icons**: Lucide React for UI icons

**Key UI Features:**
- Navigation bar with conditional rendering
- Multi-step forms with validation
- Collapsible analysis cards with smooth animations
- Status indicators with color coding
- Interactive health metrics (soon)
- PDF download buttons
- Star rating system for feedback
- Modal dialogs for forms
- Toast notifications for feedback

---

## 🔄 COMPLETE DATA FLOW

```
USER JOURNEY:
1. Register/Login → Authenticate with JWT
2. Go to Symptom Checker → Load saved profile (if exists)
3. Fill health info (Step 1) → Save to database
4. Enter current symptoms (Step 2) → Validate
5. Click Analyze → Send to backend with GPS location
6. Backend calls Groq AI → Get medical analysis
7. Backend calls Overpass API → Get nearby doctors
8. Calculate distances → Sort by proximity
9. Save analysis record → Return to frontend
10. Display results → Show condition, recommendations, doctors
11. User can download PDF → generateAnalysisPDF() called
12. View Dashboard → See all past analyses
13. Click analysis → Expand to see full details
14. Submit feedback → Save to database
15. View community feedbacks → See random testimonials
```

---

## 🚀 TECHNOLOGY STACK

**Frontend:**
- React 18.3 with React Router 7.15
- Axios + Fetch API for HTTP requests
- jsPDF + html2canvas for PDF generation
- Lucide React for icons
- localStorage for client-side persistence
- CSS-in-JS for styling

**Backend:**
- Node.js + Express 5.2
- MongoDB 9.6 with Mongoose ODM
- JWT for authentication
- Bcryptjs for password hashing
- Groq API for AI
- Overpass API for geolocation
- Nodemailer for email

**DevTools:**
- Git for version control
- npm for dependency management
- ESLint for code quality

---

## 📈 CURRENT FEATURES MATRIX

| Feature | Status | Complexity | Impact |
|---------|--------|-----------|--------|
| User Authentication | ✅ Complete | Basic | High |
| Health Profile | ✅ Complete | Basic | High |
| AI Symptom Analysis | ✅ Complete | Complex | High |
| Nearby Doctors | ✅ Complete | Complex | High |
| Analysis History | ✅ Complete | Basic | Medium |
| Feedback System | ✅ Complete | Basic | Medium |
| PDF Reports | ✅ Complete | Medium | Medium |
| Responsive UI | ✅ Complete | Basic | High |
| Password Reset | ✅ Complete | Medium | Medium |

---

## 📝 SUMMARY

MedCheck is a **fully functional AI-powered healthcare platform** with:
- ✅ Secure user authentication system
- ✅ AI-driven symptom analysis using Groq API
- ✅ Real-time geolocation-based doctor recommendations
- ✅ Persistent health profile management
- ✅ Comprehensive analysis history tracking
- ✅ Community feedback and testimonial system
- ✅ Professional PDF report generation
- ✅ Responsive and user-friendly interface
- ✅ Protected routes with JWT authentication
- ✅ Role-based access control (extensible)

**Current Users Can:**
- Sign up and authenticate securely
- Complete detailed health questionnaire
- Receive AI-powered medical analysis
- Find nearby medical facilities
- Download analysis reports
- Track health history
- Leave community feedback
- Manage their health profile

---

**Created:** December 2024  
**Version:** 1.0 Complete  
**Status:** Production Ready (with Groq API key)
