# MedCheck - System Workflow & Architecture Guide

## 📋 System Overview

MedCheck is an intelligent medical symptom checker platform that connects patients with healthcare professionals. The system provides AI-powered symptom analysis, doctor discovery, and appointment booking functionalities.

---

## 🎯 Key Modules & Their Workflows

### 1. **Home Page** (`src/pages/Home.jsx`)
**Purpose**: Landing page introducing the platform

**What It Does**:
- Displays hero section with value proposition
- Shows key features (Smart Analysis, Doctor Network, Convenient Scheduling)
- Explains step-by-step workflow (4-step process)
- Builds trust with statistics (50K+ users, 800+ doctors, 98% satisfaction)
- Provides detailed feature breakdown
- CTAs to register or start symptom check (for logged-in users)

**User Interaction**:
- New visitors: Click "Get Started Free" or "Sign In"
- Logged-in patients: Click "Start Symptom Check"

---

### 2. **Authentication Pages**

#### **Login Page** (`src/pages/Login.jsx`)
**Purpose**: Authenticate existing users

**What It Does**:
- Email validation
- Password validation
- Error handling for invalid credentials
- Stores user data in localStorage
- Redirects to appropriate dashboard based on user role

**Role-Based Redirects**:
- Patient → `/symptom-checker`
- Doctor → `/doctor/dashboard`

**Data Stored** (localStorage):
```json
{
  "id": "unique_id",
  "name": "User Name",
  "email": "user@example.com",
  "password": "hashed_password",
  "role": "patient|doctor"
}
```

#### **Register Page** (`src/pages/Register.jsx`)
**Purpose**: Create new user accounts

**What It Does**:
- Collects full name, email, password
- Validates password match
- Allows role selection (Patient or Healthcare Professional)
- Creates user account
- Auto-logs in user after registration

**Validation Rules**:
- Name: Required, non-empty
- Email: Valid email format
- Password: Minimum 6 characters
- Password Confirmation: Must match password field

---

### 3. **Symptom Checker Module** (`src/pages/SymptomChecker.jsx`)
**Purpose**: Collect patient symptoms and analyze them

**Workflow** (2-Step Process):

#### **Step 1: Symptom Input**
- User enters primary symptom (e.g., "fever", "persistent headache")
- User selects associated symptoms from predefined list:
  - Fever, Headache, Cough, Fatigue, Body Aches, Sore Throat, Runny Nose, Nausea
- At least one symptom must be selected to proceed

#### **Step 2: Context Information**
- **Duration Selection**:
  - Less than 24 hours
  - 1-3 days
  - 3-7 days
  - 1-2 weeks
  - More than 2 weeks

- **Severity Selection**:
  - Mild: Slightly uncomfortable but manageable
  - Moderate: Interferes with daily activities
  - Severe: Significantly impacting daily life

- **Summary Display**: Shows all collected information

**Data Collected**:
```json
{
  "mainSymptom": "fever",
  "selectedSymptoms": ["fever", "headache", "body aches"],
  "duration": "1-3-days",
  "severity": "moderate",
  "timestamp": "2026-05-24T10:30:00Z"
}
```

**Next Step**: Analysis is performed and user is navigated to Results page

---

### 4. **Results Analysis Page** (`src/pages/Results.jsx`)
**Purpose**: Display AI analysis and recommendations

**What It Shows**:

#### **Urgency Assessment**
- **Levels**: Monitor & Self-Care, Seek Care Soon, Urgent Care Needed
- **Recommended Specialist**: Based on symptoms

#### **Possible Conditions** (with probabilities)
- Lists 4-5 potential conditions
- Shows likelihood percentage (25%-75%)
- Provides brief description of each condition
- Visual probability bar for each condition

**Example Results**:
```
- Common Cold: 75%
  "A viral respiratory infection typically mild and self-limiting"
  
- Flu (Influenza): 45%
  "A more serious viral infection that may require medical attention"
```

#### **Care Recommendations**
- Get adequate rest and drink fluids
- Monitor temperature regularly
- Consider over-the-counter pain relievers
- Schedule doctor appointment within 2-3 days
- Seek emergency care if symptoms worsen

#### **Action Items**
- **Find Doctors**: Navigate to doctor discovery
- **Download Analysis**: Save results as text file

#### **Disclaimer**
- Clear medical liability statement
- Emphasizes need for professional diagnosis

---

### 5. **Find Doctors Module** (`src/pages/FindDoctors.jsx`)
**Purpose**: Help patients discover and connect with healthcare professionals

**Filtering Options**:
1. **Specialty**: General Practitioner, ENT Specialist, Infectious Disease, Cardiologist
2. **City**: New York, Los Angeles, Chicago, Houston, Phoenix
3. **Minimum Rating**: 4.0+, 4.5+, 4.8+

**Doctor Information Display**:
- Doctor name with emoji avatar
- Specialty classification
- Bio/description
- Location
- Years of experience
- Patient rating (1-5 stars)
- Number of patient reviews
- Availability times
- Consultation price
- Quick "Book Appointment" button

**Example Doctor Profile**:
```
Dr. Sarah Johnson
General Practitioner
"Board-certified GP specializing in preventive care"
📍 New York
🏆 15 years experience
⭐ 4.8 (245 reviews)
🕐 Mon-Fri, 9AM-6PM
💰 $50 per session
```

**Functionality**:
- Filter doctors by specialty, location, rating
- Clear applied filters
- Real-time count of matching doctors
- Empty state message when no matches

---

### 6. **Book Appointment Module** (`src/pages/BookAppointment.jsx`)
**Purpose**: Allow patients to schedule consultations

**Workflow** (2-Step Process):

#### **Step 1: Date & Time Selection**
- Show 5-day calendar with available dates
- Display available time slots for selected date
- User must select both date and time
- Available slots per day: 4 time slots (e.g., 09:00, 10:00, 14:00, 15:30)

#### **Step 2: Appointment Details**
- **Consultation Type**:
  - Video Consultation (Online)
  - In-Person Visit (Clinic)
  - Phone Call Consultation

- **Additional Notes**: Optional field for patient to describe symptoms/concerns

- **Booking Summary**: Shows:
  - Doctor name and specialty
  - Selected date (formatted, e.g., "Monday, May 24, 2026")
  - Selected time
  - Consultation type
  - Total cost

**Appointment Data Stored** (localStorage):
```json
{
  "id": "appointment_id",
  "doctorId": "doctor_id",
  "doctor": {...doctor_data},
  "date": "2026-05-24",
  "time": "14:00",
  "type": "video",
  "notes": "patient notes...",
  "status": "confirmed",
  "bookedAt": "2026-05-24T10:30:00Z"
}
```

**After Booking**:
- Appointment saved to localStorage
- User redirected to Patient Dashboard
- Confirmation message displayed

---

### 7. **Patient Dashboard** (`src/pages/PatientDashboard.jsx`)
**Purpose**: Central hub for patient appointments and health tracking

**Expected Features** (to be implemented):
- View all upcoming appointments
- Cancel/reschedule appointments
- View past appointments
- Download medical reports
- View symptom analysis history
- Health tracking charts

---

### 8. **Doctor Dashboard** (`src/pages/DoctorDashboard.jsx`)
**Purpose**: Healthcare professional management interface

**Expected Features** (to be implemented):
- View scheduled appointments
- Patient case management
- Prescription issuance
- Patient communication
- Schedule management

---

## 🔄 User Journey Flows

### **New Patient Flow**:
```
Home Page → Register → Login → Symptom Checker → Results → Find Doctors → Book Appointment → Dashboard
```

### **Returning Patient Flow**:
```
Home Page → Login → Dashboard (or Symptom Checker for new check)
```

### **Registered Doctor Flow**:
```
Home Page → Login → Doctor Dashboard → Manage Appointments
```

---

## 🗄️ Data Storage (Current - localStorage)

### **User Data**:
- Stored in `localStorage.user`
- Contains: id, name, email, password, role

### **Analysis Data**:
- Stored in `localStorage.analysisData`
- Persists across navigation

### **Appointments**:
- Stored in `localStorage.appointments`
- Array of appointment objects
- Retrieved in Dashboard

---

## 🎨 Color Scheme

**Light Blue & White Theme**:
- **Kawaii Sky Blue** (#9ABDDC) - Primary accent
- **Diamond Blue** (#AECCE4) - Secondary accent
- **Beau Blue** (#BDD5E7) - Tertiary accent
- **Subtle Blue** (#D1E5F4) - Light backgrounds
- **Snowbound** (#E5F3FD) - Very light backgrounds
- **Arctic Ice** (#F5FBFF) - Lightest backgrounds
- **White** (#FFFFFF) - Main background
- **Slate** (various shades) - Text

---

## 📊 Mock Data Sources

### **Doctors Database**:
- 6 sample doctors with varying specialties
- Realistic names, ratings, experience levels
- Multiple cities and specialties

### **Symptoms**:
- Common symptoms list (8 items)
- Categories: physical symptoms

### **Conditions**:
- Sample conditions with probabilities
- Descriptions and severity levels

### **Appointment Slots**:
- 5-day availability
- 4 time slots per day

---

## ⚙️ Protected Routes

All patient-specific routes require authentication:
- `/symptom-checker` - Patient only
- `/results` - Patient only
- `/doctors` - Patient only
- `/book/:doctorId` - Patient only
- `/patient/dashboard` - Patient only
- `/doctor/dashboard` - Doctor only

Unauthenticated users are redirected to login page.

---

## 🔧 Current Limitations & Future Implementation

### **Current Status** (Frontend Only):
- ✅ User authentication (localStorage)
- ✅ Symptom collection form
- ✅ Mock AI analysis results
- ✅ Doctor discovery with filters
- ✅ Appointment booking flow
- ❌ Real backend API integration
- ❌ Real database persistence
- ❌ Email notifications
- ❌ Actual AI analysis engine
- ❌ Payment processing
- ❌ Real doctor profiles

---

## 📱 Responsive Design

All pages are fully responsive with:
- Mobile-first approach
- Tablet optimization (md breakpoint: 768px)
- Desktop layout (lg breakpoint: 1024px)
- Touch-friendly buttons and inputs

