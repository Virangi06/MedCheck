# MedCheck - Complete Project Documentation

## Project Overview
**MedCheck** is a MERN-stack healthcare application that provides real-time AI-powered symptom analysis via Server-Sent Events (SSE) streaming, personalized doctor recommendations based on location, local drug interaction checking, dynamic health metrics charts, daily health tips checklist, health profile management, and community feedback features.

---

## 🎯 CORE FUNCTIONALITIES

### 1. **USER AUTHENTICATION SYSTEM**
**Module**: Authentication (Login, Register, Logout, Password Reset)

**Functionalities:**
- **User Registration** - Create new account with name, email, password
- **User Login** - Authenticate with email/password, receive JWT token
- **User Logout** - Invalidate token and clear user session state
- **Email Verification via OTP** - 6-digit OTP sent to email for password reset
- **Password Reset** - Change forgotten password through OTP verification
- **Role-Based Access Control** - Different roles: Patient, Doctor, Admin (future)
- **Token Management** - JWT tokens stored in localStorage, 7-day expiry
- **Protected Routes** - Unauthorized users redirected to login

**Files Involved:**
- Frontend: `Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`, `VerifyOtp.jsx`, `ResetPassword.jsx` (under `pages/`), `context/AuthContext.jsx`
- Backend: `authController.js`, `authRoutes.js`
- Database: `User.js` model
- Middleware: `authMiddleware.js` (JWT verification)

---

### 2. **AI-POWERED SYMPTOM ANALYSIS (STREAMING)**
**Module**: Symptom Checker & Streaming Analysis

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
- **AI Streaming via Groq API (SSE)** - Streams tokens of analysis from Groq Cloud in real-time.
- **Client-Side Partial JSON Parser** - Parses incomplete JSON strings from the Event Stream using regex patterns, rendering details instantly.
- **Model Fallback Logic** - Automatically switches to Llama 3.1 8B if the primary Llama 3.3 70B model encounters rate limits.
- **Stream-Aware UX** - Displays pulsing skeleton loaders for clinical fields still being written, and locks action download buttons until generation completes.
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
- Frontend: `pages/SymptomChecker.jsx`
- Backend: `controllers/analysisController.js`, `services/aiService.js`, `routes/analysisRoutes.js`, `utils/groqHelper.js`, `utils/emergencyCheck.js`
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
  - Height
  - Weight
  - Existing Diseases
  - Current Medications
  - Known Allergies
  - Sleep Patterns
  - Activity Level
  - Health Goals

**Files Involved:**
- Frontend: `pages/SymptomChecker.jsx`, `pages/PatientDashboard.jsx`
- Backend: `controllers/profileController.js`, `routes/profileRoutes.js`
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
- **Maximum 10 Facilities** - Shows top 10 nearest facilities
- **Fallback Mock Data** - Provides sample data if API is unavailable
- **Real-Time Search** - Uses OpenStreetMap data via Overpass API

**Files Involved:**
- Frontend: `pages/SymptomChecker.jsx`, `pages/PatientDashboard.jsx`
- Backend: `services/locationService.js`, `utils/calculateDistance.js`, `controllers/analysisController.js`
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
- Frontend: `pages/PatientDashboard.jsx`, `pages/Results.jsx`
- Backend: `controllers/analysisController.js` getHistory()
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
- Frontend: `pages/Home.jsx` (testimonials), `pages/PatientDashboard.jsx` (manage feedback), `services/feedbackAPI.js`
- Backend: `controllers/feedbackController.js`, `routes/feedbackRoutes.js`
- Database: `Feedback.js` model

---

### 7. **DRUG INTERACTION CHECKER**
**Module**: Local & Server Medicine Interaction Auditing

**Functionalities:**
- **Local Interaction Warning** - Compares user's profile medications against AI-suggested medicines to scan for hazardous combinations instantly.
- **Drug Info Query** - Search details, usage warnings, side effects, and precautions of any medication.
- **Safety Flags** - Instantly renders high-priority warning boxes if contraindicated medications are used together.

**Files Involved:**
- Frontend: `components/MedicineInteractionChecker.jsx`, `utils/medicineChecker.js`, `services/medicineService.js`
- Backend: `controllers/medicineController.js`, `routes/medicineRoutes.js`, `utils/medicineChecker.js`

---

### 8. **DAILY HEALTH TIPS FEED & GOALS**
**Module**: Daily Wellness Recommendations

**Functionalities:**
- **Personalized Daily Tips** - Renders AI-generated daily tips targeted to user chronic diseases and symptom checker history.
- **Daily Goals Checklist** - Provides actionable goals (e.g. hydrate, take specific medications) and updates completion logs.
- **Goal Toggling** - Saves task completion statuses to database.

**Files Involved:**
- Frontend: `components/HealthTipsFeed.jsx`, `services/tipsService.js`
- Backend: `controllers/tipsController.js`, `routes/tipsRoutes.js`
- Database: `HealthTip.js`, `PersonalizedRecommendation.js` models

---

### 9. **HEALTH METRICS & VISUAL ANALYTICS**
**Module**: Visual Dashboard Charts

**Functionalities:**
- **Symptom frequency bar charts** - Compiles diagnostic history into dynamic charts.
- **Mongoose TTL Dashboard Cache** - Caches statistics results for 24 hours via database indexes to prevent heavy resource computation, automatically clearing when a checkup finishes.
- **Daily Metrics log** - Log steps, weight, heart rate, blood pressure, sleep, and calculates BMI.

**Files Involved:**
- Frontend: `components/HealthStatisticsDashboard.jsx`, `services/statisticsService.js`
- Backend: `controllers/statisticsController.js`, `routes/statisticsRoutes.js`
- Database: `HealthMetric.js`, `StatisticsCache.js` models

---

### 10. **PDF REPORT GENERATION**
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

### 11. **RESPONSIVE USER INTERFACE**
**Module**: Frontend Pages & Components

**Public Pages:**
- **Home** - Landing page with feature highlights and testimonials
- **Product Info Pages** - Details about AI analysis (`AISymptomAnalysis.jsx`), doctor suggestions (`DoctorSuggestions.jsx`), health insights (`HealthInsights.jsx`), and health history (`HealthHistory.jsx`)
- **Symptoms** - Public landing page detailing symptoms index (`Symptoms.jsx`)
- **Legal Pages** - Privacy policy (`PrivacyPolicy.jsx`), terms of service (`TermsOfService.jsx`), medical disclaimer (`MedicalDisclaimer.jsx`), cookie policy (`CookiePolicy.jsx`)
- **Authentication Pages** - Login, Register, Forgot password flow

**Protected Pages:**
- **Symptom Checker** - Multi-step symptom analysis form with Event Stream viewer (`SymptomChecker.jsx`)
- **Results** - Detailed static reports view (`Results.jsx`)
- **Patient Dashboard** - View history, manage profile, log feedback, monitor metrics, view visual charts and health tips (`PatientDashboard.jsx`)

**Reusable Components:**
- Navbar - Navigation with conditional rendering (`Navbar.jsx`)
- Button, Badge - UI visual helpers (`Button.jsx`, `Badge.jsx`)
- Card, MedCheckLogo - UI containers (`Card.jsx`, `MedCheckLogo.jsx`)
- MedIcon - Icon library wrapper (`MedIcon.jsx`)

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

Logout:
POST /api/auth/logout → Clear JWT Token & Session State on client-side

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
- age (String)
- gender (String) - Male/Female/Other
- height (String) - in cm
- weight (String) - in kg
- diseases (String) - Existing conditions
- medications (String) - Current medications
- allergies (String) - Known allergies
- sleepPatterns (String) - Sleep statistics
- activityLevel (String) - Activity logs
- healthGoals (String) - Goal description
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

### **HealthMetric Model**
```
- user (Reference to User)
- date (String) - YYYY-MM-DD
- heartRate (Number)
- bloodPressure (Object) - {systolic, diastolic}
- weight (Number)
- sleepDuration (Number)
- activityLevel (Number)
- healthScore (Number)
- bmi (Number)
- createdAt, updatedAt (Timestamps)
```

### **HealthTip Model**
```
- title (String)
- content (String)
- category (String)
- conditions (Array of Strings)
- upvotes (Array of References to User)
- sharesCount (Number)
- isAiGenerated (Boolean)
- createdAt, updatedAt (Timestamps)
```

### **PersonalizedRecommendation Model**
```
- user (Reference to User)
- date (String) - YYYY-MM-DD
- recommendations (Array of Objects) - [{title, content, category, priority, actionable, completed}]
- createdAt, updatedAt (Timestamps)
```

### **StatisticsCache Model**
```
- userId (Reference to User, Unique)
- totalAnalyses (Number)
- symptomFrequency (Array) - [{symptom, count, percentage}]
- urgencyStats (Object) - {low, moderate, high, emergency}
- mostCommonConditions (Array) - [{condition, count, percentage, lastDetected}]
- monthlyData (Array) - [{month, analysisCount, averageUrgency, highUrgencyCount}]
- insights (Object) - {totalAnalyses, averageUrgencyLevel, riskLevel, mostRecentAnalysis, topCondition, recommendedAction, trend, calculatedAt}
- aiAssessment (Object) - Cached AI health analysis report
- aiAssessmentCount (Number)
- lastUpdated (Date)
- expiresAt (Date) - TTL Cache index
```

---

## 🔗 API ENDPOINTS SUMMARY

| Method | Endpoint | Protection | Purpose |
|--------|----------|-----------|---------|
| POST | /api/auth/register | Public | User registration |
| POST | /api/auth/login | Public | User login |
| POST | /api/auth/logout | Public | User logout |
| GET | /api/auth/me | Protected | Get current user |
| POST | /api/auth/forgot-password | Public | Request password reset |
| POST | /api/auth/verify-otp | Public | Verify OTP |
| POST | /api/auth/reset-password | Public | Reset password |
| POST | /api/auth/change-password | Protected | Change password |
| POST | /api/analysis/analyze | Protected | Submit symptom analysis (SSE Stream) |
| GET | /api/analysis/history | Protected | Get user's analyses |
| GET | /api/profile | Protected | Get user's profile |
| GET | /api/profile/init | Protected | Initialize profile |
| PUT | /api/profile | Protected | Update profile |
| POST | /api/feedback/create | Protected | Submit feedback |
| GET | /api/feedback/all | Public | Get all approved feedbacks |
| GET | /api/feedback/my-feedbacks | Protected | View user's feedbacks |
| PUT | /api/feedback/update/:id | Protected | Update feedback |
| DELETE | /api/feedback/delete/:id | Protected | Delete feedback |
| GET | /api/feedback/random/:limit | Public | Random feedbacks |
| GET | /api/health | Public | Health check |
| GET | /api/tips | Protected | Get daily health tips feed |
| PATCH | /api/tips/recommendations/:id/toggle | Protected | Toggle recommendation completion |
| GET | /api/statistics/dashboard | Protected | Fetch dashboard statistics |
| GET | /api/statistics/summary | Protected | Fetch statistics summary |
| POST | /api/statistics/clear-cache | Protected | Clear statistics cache |
| GET | /api/statistics/metrics | Protected | Fetch health metrics history |
| POST | /api/statistics/metrics | Protected | Save health metric entry |
| POST | /api/statistics/ai-assessment | Protected | Run AI health assessment compilation |
| POST | /api/medicine/check | Protected | Verify active drug-to-drug interactions |
| GET | /api/medicine/my-medications | Protected | Resolve profile medication list |
| POST | /api/medicine/lookup | Protected | Query drug profile metrics & instructions |

---

## 🛠️ EXTERNAL INTEGRATIONS

### **1. Groq AI API**
- **Purpose**: AI-powered symptom analysis (real-time Event-Stream)
- **Model**: Llama 3.3 70B (primary), Llama 3.1 8B (fallback)
- **Centralized Handler**: Managed via `callGroqWithFallback` helper to handle rate limits and service failures gracefully.
- **Input**: Patient health data and symptoms
- **Output**: Medical analysis JSON text streamed back token-by-token
- **Response Time**: Real-time streaming initialization within 1s

### **2. Overpass API (OpenStreetMap)**
- **Purpose**: Find nearby medical facilities
- **Data Source**: OpenStreetMap community data
- **Radius**: 5km from user location
- **Returns**: Hospitals, clinics, doctors, pharmacies sorted by distance

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
- **Components**: Cards, badges, buttons, collapsible sections, skeleton loaders
- **Icons**: Lucide React for UI icons

**Key UI Features:**
- Navigation bar with conditional rendering
- Multi-step forms with validation
- Collapsible analysis cards with smooth animations
- Real-time Event-Stream results renderer
- Status indicators with color coding
- Interactive health metrics dynamic logging
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
5. Click Analyze → Backend opens SSE event stream connection
6. Backend streams AI diagnostic tokens from Groq API in real-time
7. Frontend reads stream and parses partial JSON live via regex to render fields incrementally with skeleton screens
8. Once the stream ends, the backend fetches nearby clinics from Overpass API
9. Calculate clinic distances via Haversine formula → Sort by proximity
10. Persist analysis report in MongoDB and clear statistics cache
11. Send final 'done' SSE event payload to render clinics and unlock download/save actions
12. User can download PDF report → generateAnalysisPDF() called
13. View Dashboard → See all past analyses, visual analytics, charts, and cache-backed AI assessment
14. Submit feedback → Save to database
15. View community feedbacks → See random testimonials
```

---

## 🚀 TECHNOLOGY STACK

**Frontend:**
- React 18.3 with React Router 7.15
- Fetch API for stream reading
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
| AI Symptom Analysis (SSE) | ✅ Complete | Complex | High |
| Geolocation Clinics | ✅ Complete | Complex | High |
| Drug Interaction Checker | ✅ Complete | Medium | High |
| Health Metrics Log | ✅ Complete | Medium | Medium |
| Visual Statistics Dashboard| ✅ Complete | Complex | High |
| Personalized Daily Tips | ✅ Complete | Complex | High |
| Analysis History | ✅ Complete | Basic | Medium |
| Feedback System | ✅ Complete | Basic | Medium |
| PDF Reports | ✅ Complete | Medium | Medium |
| Responsive UI | ✅ Complete | Basic | High |
| Password Reset | ✅ Complete | Medium | Medium |

---

## 📝 SUMMARY

MedCheck is a **fully functional AI-powered healthcare platform** with:
- ✅ Secure user authentication system
- ✅ Real-time AI symptom analysis using Groq API via SSE Stream
- ✅ Real-time geolocation-based clinic recommendations
- ✅ Local drug interaction checking
- ✅ Daily health tips and goal checklist
- ✅ Statistics caching and health metrics logs
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
- Receive live AI-powered medical analysis
- Check drug interactions locally
- Track daily checklists and wellness tips
- Monitor health statistics and charts
- Find nearby medical facilities
- Download analysis reports
- Track health history
- Leave community feedback
- Manage their health profile

---

**Created:** June 2026 
**Version:** 1.0.0 Complete  
**Status:** Production Ready (with Groq API key)
