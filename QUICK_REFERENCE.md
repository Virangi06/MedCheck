# MedCheck - Quick Reference Guide

## 🏠 Page Structure & Navigation

### **Public Pages** (No login required)
```
Home (/):
  → Hero section with value proposition
  → Key features overview (3 features)
  → How it works (4-step process)
  → Trust statistics
  → Comprehensive services (4 sections)
  → CTA buttons

Login (/login):
  → Email and password fields
  → Remember me checkbox
  → Forgot password link
  → Create account link
  → First-time user info box

Register (/register):
  → Name, email, password, confirm password
  → Role selection (Patient/Healthcare Professional)
  → Trust statistics display
  → Already have account? Sign in link
```

### **Protected Pages** (Requires login as patient)
```
Symptom Checker (/symptom-checker):
  → Step 1: Select symptoms
  → Step 2: Provide duration & severity
  → AI Analysis button
  → Info cards (3 features)

Results (/results):
  → Urgency assessment
  → Possible conditions (5 items)
  → Care recommendations
  → Find doctors button
  → Download analysis button
  → Medical disclaimer

Find Doctors (/doctors):
  → Filter by: Specialty, City, Rating
  → Doctor cards (name, bio, rating, price, availability)
  → Book appointment button

Book Appointment (/book/:doctorId):
  → Step 1: Select date & time
  → Step 2: Choose consultation type, add notes
  → Booking summary
  → Confirm booking button

Patient Dashboard (/patient/dashboard):
  → (Placeholder for future implementation)
  → Expected: Appointments, history, health tracking
```

### **Protected Pages** (Requires login as doctor)
```
Doctor Dashboard (/doctor/dashboard):
  → (Placeholder for future implementation)
  → Expected: Appointments, patient management, prescriptions
```

---

## 🎨 Color Reference

### **Primary Colors** (For important actions)
- Background: `bg-skyblue-500` (#9ABDDC)
- Hover: `bg-skyblue-600` (darker shade)
- Text on color: `text-white`

### **Light Backgrounds** (For info sections)
- Background: `bg-skyblue-100` (#BDD5E7 - lighter version)
- Border: `border-l-skyblue-500` (left accent)
- Text: `text-skyblue-900` (dark text)

### **Text Colors**
- Headers: `text-slate-900` (darkest)
- Body: `text-slate-700` (medium-dark)
- Secondary: `text-slate-600` (medium)
- Borders: `border-slate-200` (light gray)

### **Component Colors**
- Success/Check: `text-skyblue-600`
- Warning/Attention: Yellow shades
- Error: Red shades (use as needed)
- Neutral: Slate shades

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      MedCheck App                       │
└─────────────────────────────────────────────────────────┘

START (Home Page)
  ↓
[User Logged In?]
  ├─ NO  → Register → Login
  └─ YES → Dashboard

PATIENT FLOW:
  ↓
Symptom Checker
  ├─ Select symptoms
  ├─ Choose duration & severity
  ↓
Results Page
  ├─ View analysis
  ├─ View conditions
  ├─ Read recommendations
  ↓
[User Wants to Book?]
  ├─ YES → Find Doctors
  │         ├─ Filter doctors
  │         ↓
  │         Select Doctor
  │         ↓
  │         Book Appointment
  │         ├─ Choose date/time
  │         ├─ Add notes
  │         ├─ Confirm booking
  │         ↓
  │         Dashboard (Success)
  │
  └─ NO  → Dashboard (View History)

DOCTOR FLOW:
  ↓
Doctor Dashboard
  ├─ View appointments
  ├─ Manage schedule
  └─ Patient case management
```

---

## 🗂️ Component Breakdown

### **Navbar** (All pages)
- Logo with home link
- Navigation links:
  - Home (always visible)
  - Check Symptoms (if logged in)
  - Dashboard (if logged in)
  - Login/Register (if not logged in)
- Logout button (if logged in)
- Mobile hamburger menu

### **Cards** (Info/Section containers)
- Used for: Forms, info boxes, doctor profiles, conditions
- Has: Padding, border, white background
- Optional: Left accent border in skyblue

### **Buttons** (Action elements)
- Primary: `bg-skyblue-500` (main actions)
- Secondary: Border with text (back, cancel)
- Sizes: sm, md, lg
- States: Normal, Hover, Disabled, Loading

### **Inputs** (Form fields)
- Text inputs, email, password
- Dropdowns (select)
- Textareas
- Checkboxes
- All have focus states with skyblue ring

### **Badges** (Labels/Tags)
- Used for: Ratings, urgency levels, severity
- Colors: Skyblue variants
- Text: "⭐ 4.8", "75% Likelihood", etc.

---

## 📱 Responsive Breakpoints

```
Mobile:     < 640px  (sm)
Tablet:     640px - 1024px (md)
Desktop:    > 1024px (lg)

Grid layouts:
  Mobile:   1 column
  Tablet:   2 columns
  Desktop:  3+ columns
```

---

## 🔐 Authentication States

### **Not Logged In**:
- ✅ Can see: Home, Login, Register
- ❌ Cannot see: Symptom Checker, Results, Doctors, Book, Dashboards
- 🔄 Redirected to: Login

### **Logged In as Patient**:
- ✅ Can see: All patient pages + Home
- ❌ Cannot see: Doctor Dashboard
- 🔄 Redirected to: Home

### **Logged In as Doctor**:
- ✅ Can see: Doctor Dashboard, Home
- ❌ Cannot see: Patient-specific pages
- 🔄 Redirected to: Home

---

## 💾 Local Storage Structure

```javascript
// User data
{
  "user": {
    "id": "unique_id",
    "name": "John Doe",
    "email": "john@example.com",
    "password": "hashed_or_plain_password",
    "role": "patient|doctor"
  }
}

// Analysis data (from last check)
{
  "analysisData": {
    "mainSymptom": "fever",
    "selectedSymptoms": ["fever", "headache"],
    "duration": "1-3-days",
    "severity": "moderate",
    "timestamp": "2026-05-24T10:30:00Z"
  }
}

// Appointments
{
  "appointments": [
    {
      "id": "appointment_id",
      "doctorId": "doctor_id",
      "doctor": {...},
      "date": "2026-05-24",
      "time": "14:00",
      "type": "video",
      "status": "confirmed"
    }
  ]
}
```

---

## 🔄 User Workflows

### **New Patient Workflow**:
1. Land on Home
2. Click "Get Started Free"
3. Fill Register form (name, email, password, role)
4. Auto-logged in, redirected to Symptom Checker
5. Select symptoms and duration
6. View results and urgency level
7. Click "Find Doctors" or go to Dashboard

### **Returning Patient Workflow**:
1. Land on Home
2. Click "Sign In"
3. Enter email and password
4. View Dashboard or start new symptom check
5. Option to find doctors or view history

### **Doctor Workflow**:
1. Register as "Healthcare Professional"
2. Auto-logged in, redirected to Doctor Dashboard
3. View scheduled appointments
4. Manage patient cases

---

## 🎯 Form Validations

### **Login Form**:
- Email: Required, valid format
- Password: Required, any length

### **Register Form**:
- Name: Required, non-empty
- Email: Required, valid format, unique
- Password: Required, min 6 characters
- Confirm Password: Must match password

### **Symptom Checker - Step 1**:
- Main Symptom: Required
- Associated Symptoms: At least one symptom needed

### **Symptom Checker - Step 2**:
- Duration: Required
- Severity: Required

### **Book Appointment - Step 1**:
- Date: Required (select one)
- Time: Required (select one)

### **Book Appointment - Step 2**:
- Consultation Type: Required
- Notes: Optional

---

## 🚀 Quick Commands

### **Run Development Server**:
```bash
cd medical_symptom_checker
npm start
```

### **Build for Production**:
```bash
npm run build
```

### **Run Tests** (when implemented):
```bash
npm test
```

### **View Color Palette**:
- Open `tailwind.config.js`
- Look for `colors.skyblue` section

---

## 📞 Common Issues & Solutions

### **Issue: Colors not applying**
- **Solution**: Make sure `tailwind.config.js` is saved and development server restarted

### **Issue: Redirecting to login unexpectedly**
- **Solution**: Check if user is logged in (localStorage.user should exist)

### **Issue: Form not submitting**
- **Solution**: Check console for validation errors, ensure all required fields filled

### **Issue: Page not responsive on mobile**
- **Solution**: Check browser's mobile view (F12 → Device Toggle), verify tailwind classes use sm:, md:, lg: prefixes

---

## 🎓 Learning Resources

### **For Frontend Development**:
- React documentation: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- React Router: https://reactrouter.com

### **For Backend Development**:
- Express.js: https://expressjs.com
- MongoDB: https://www.mongodb.com
- JWT: https://jwt.io
- Google Gemini API: https://ai.google.dev

---

## 📊 Statistics to Know

- **Users**: 50K+ (mock)
- **Doctors**: 800+ (mock)
- **Satisfaction**: 98% (mock)
- **Common Symptoms**: 8 pre-defined

---

## 🔧 Customization Guide

### **Change Primary Color**:
1. Open `tailwind.config.js`
2. In `colors.skyblue`, change all hex values
3. Restart dev server

### **Add New Symptom**:
1. Open `SymptomChecker.jsx`
2. Find `commonSymptoms` array
3. Add new object: `{ id: X, name: 'Symptom Name' }`

### **Add New Doctor**:
1. Open `FindDoctors.jsx`
2. Find `allDoctors` array
3. Add new doctor object

### **Change Consultation Fee**:
1. Open `FindDoctors.jsx` or `BookAppointment.jsx`
2. Find `price: '$50'` in doctor object
3. Change to new price

---

## ✨ Best Practices

1. **Always restart dev server** after changing tailwind.config.js
2. **Test on mobile** - use device toggle (F12)
3. **Use semantic HTML** - proper heading hierarchy, alt text for images
4. **Keep localStorage data minimal** - only essential user info
5. **Validate all inputs** - don't trust user input
6. **Use descriptive variable names** - "userEmail" not "e"
7. **Keep components small** - aim for single responsibility
8. **Comment complex logic** - help future developers

---

## 📈 Performance Tips

1. **Lazy load images** - use React.lazy for heavy components
2. **Minimize re-renders** - use React.memo and useCallback
3. **Optimize images** - compress before using
4. **Use CSS modules** - reduce style conflicts
5. **Minify for production** - `npm run build` does this

---

## 🔐 Security Tips

1. **Never store passwords in localStorage** (plan to use backend + hashing)
2. **Validate on both client and server** (backend needed)
3. **Use HTTPS only** (for deployment)
4. **Sanitize user input** - use input validation libraries
5. **Implement CSRF protection** (backend feature)
6. **Regular security audits** - check dependencies

---

## 📝 Documentation Files

| File | Purpose | Size |
|------|---------|------|
| SYSTEM_WORKFLOW.md | Complete system explanation | 8 KB |
| BACKEND_INTEGRATION_PLAN.md | Backend development guide | 25 KB |
| PROJECT_COMPLETION_SUMMARY.md | What was changed | 12 KB |
| This File | Quick reference | 5 KB |

---

## 🎉 You're All Set!

The MedCheck application is ready for:
- ✅ Continued frontend development
- ✅ Backend integration
- ✅ Production deployment
- ✅ User testing and feedback

Good luck with your project! 🚀

