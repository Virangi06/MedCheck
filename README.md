# 🩺 MedCheck — AI-Powered Patient Diagnostics & Health Ecosystem

MedCheck is a full-stack, state-of-the-art medical diagnostics portal and health tracking dashboard. Leveraging high-performance LLMs (Llama 3.3/3.1 via Groq Cloud) and geographical location services, MedCheck enables patients to evaluate symptoms dynamically, check drug-to-drug interactions, locate nearby specialist clinics, and visualize historical health trends.

---

## ⚡ Key Highlights & Current Features

### 🚀 1. Real-Time AI Symptom Checker (SSE Streaming)
*   **Server-Sent Events (SSE)**: Replaces standard HTTP wait times with live, token-by-token streaming of clinical recommendations directly from Groq Cloud.
*   **Adaptive Partial JSON Parsing**: Uses a custom, client-side regex-based parser to extract and render fields dynamically (possible conditions, recovery advice, precautions) as they arrive, displaying elegant skeleton loader states.
*   **Clinical Fallback Protocols**: Automatic backend model fallbacks (Llama-3.3-70b-versatile with Llama-3.1-8b-instant backup) prevent rate limits (429) from disrupting users.

### 📍 2. Geo-Location Facility Matcher
*   **GPS Coordination**: Requests geolocation coordinates to resolve actual nearby clinics and specialized hospitals.
*   **Distance Computation**: Evaluates haversine distance math on the backend to sort and return specialists within the user's immediate vicinity.

### 💊 3. Cross-Medication Interaction Auditing
*   **Safety Verification**: Scans combined medications (reported profile treatments + recommended symptom relief drugs) for dangerous, life-threatening contraindications.
*   **Visual Alert Warnings**: Instantly flags local warning signs (such as Nitrate-Sildenafil warnings) on the screen to prevent medical emergencies.

### 📈 4. Visual Analytics & Caching
*   **Health Dashboard**: Renders interactive symptom frequency charts, monthly diagnosis trends, and health score gauges.
*   **Redis-like TTL Cache**: Utilizes MongoDB Time-To-Live (TTL) indexes to cache heavy AI-synthesized statistics assessments for 24 hours, automatically clearing cache whenever a new symptom check is completed.

### 🔐 5. Secure Auth & OTP Dispatching
*   **Stateless JWT Security**: Protected server operations verify JWT authorization headers.
*   **OTP Verification Lifecycle**: Automated generation, 5-minute database expiration, and SMTP email dispatching (via Nodemailer) for secure password recovery.

---

## 🛠 Tech Stack

```
   ┌─────────────────────────────────────────────────────────┐
   │                       REACT CLIENT                      │
   │      (React 18, React Router v7, Recharts, Axios)        │
   └────────────────────────────┬────────────────────────────┘
                                │ HTTP REST / SSE Stream
   ┌────────────────────────────▼────────────────────────────┐
   │                    EXPRESS API SERVER                   │
   │     (Node.js, Express 5, JWT, Bcrypt, Nodemailer)       │
   └──────────────┬─────────────────────────────┬────────────┘
                  │                             │
   ┌──────────────▼─────────────┐ ┌─────────────▼────────────┐
   │        MONGODB DATA        │ │        EXTERNAL SERVICES │
   │   (Mongoose Schemas, TTL)  │ │ (Groq AI, Google Places) │
   └────────────────────────────┘ └──────────────────────────┘
```

---

## 📂 Codebase Structure

```bash
MedCheck/
├── backend/
│   ├── config/              # MongoDB DB connection logic
│   ├── controllers/         # Handles HTTP requests & business logic
│   ├── middleware/          # JWT auth validation guards
│   ├── models/              # Mongoose DB schema definitions
│   ├── routes/              # Express API endpoints
│   ├── services/            # Core integration layers (Groq AI, Google Places)
│   ├── utils/               # Shared helpers (distance, email, drug checks)
│   └── server.js            # Main backend entry point
│
└── frontend/
    ├── public/              # Static public assets & template HTML
    └── src/
        ├── api/             # Axios connection configuration
        ├── assets/          # Logo images and brand vectors
        ├── components/      # Shared components (charts, tips feed, dashboards)
        ├── context/         # Auth & cached user profile state providers
        ├── pages/           # Route views (Symptom Checker, History, Policies)
        ├── services/        # Frontend API call handlers
        └── utils/           # Report PDF generators, medicine checkers
```

---

## ⚙️ Installation & Running

### 1️⃣ Environment Configurations

#### Backend Environment (`backend/.env`)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_key
GROQ_API_KEY=your_groq_developer_key
CLIENT_URL=http://localhost:3000
```

#### Frontend Environment (`frontend/.env` - optional)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 2️⃣ Start Backend Server
```bash
cd backend
npm install
npm run dev
```
*Backend active endpoint*: `http://localhost:5000`

### 3️⃣ Start Frontend Client
```bash
cd frontend
npm install
npm start
```
*Frontend interface*: `http://localhost:3000`

---

## 🔗 REST & Streaming API Reference

| Endpoint | HTTP Method | Protected | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | No | Creates user account & returns login JWT. |
| `/api/auth/login` | `POST` | No | Validates credentials & returns JWT. |
| `/api/auth/forgot-password`| `POST` | No | Generates OTP and sends validation email. |
| `/api/auth/verify-otp` | `POST` | No | Verifies verification OTP code validity. |
| `/api/auth/reset-password` | `POST` | No | Updates password with secure token. |
| `/api/auth/me` | `GET` | **Yes** | Returns details of logged-in user. |
| `/api/profile` | `GET` | **Yes** | Resolves patient's personal health profile. |
| `/api/profile` | `PUT` | **Yes** | Updates patient's permanent health details. |
| `/api/analysis/analyze` | `POST` | **Yes** | **Server-Sent Events Stream** of AI analysis. |
| `/api/analysis/history` | `GET` | **Yes** | Retrieves 20 most recent checkup results. |
| `/api/feedback/create` | `POST` | **Yes** | Submits ratings and platform reviews. |
| `/api/statistics/dashboard`| `GET` | **Yes** | Visual statistics & AI health assessments. |

---

## 👨‍💻 Author

**Virangi**
*   GitHub: [https://github.com/Virangi06](https://github.com/Virangi06)
*   Repository: [https://github.com/Virangi06/MedCheck](https://github.com/Virangi06/MedCheck)
