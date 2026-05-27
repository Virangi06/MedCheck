// ✅ FIX: dotenv v17 (dotenvx) removed the .config() method
// require('dotenv').config() silently fails in dotenv v17
// Use require('dotenv/config') instead - works in ALL versions
require('dotenv/config');

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');

// ROUTES
const authRoutes = require('./routes/authRoutes');
const analysisRoutes = require('./routes/analysisRoutes');

// Connect database
connectDB();

const app = express();

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

/* =========================================================
   API ROUTES
========================================================= */

// AUTH ROUTES
app.use('/api/auth', authRoutes);

// AI ANALYSIS ROUTES
app.use('/api/analysis', analysisRoutes);

/* =========================================================
   HEALTH CHECK ROUTE
========================================================= */

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MedCheck API is running',
    env: {
      groqKeyLoaded: !!process.env.GROQ_API_KEY,
      port: process.env.PORT,
    },
  });
});

/* =========================================================
   TEST LOCATION SERVICE
========================================================= */

app.get('/api/test/nearby-doctors', async (req, res) => {
  try {
    const { getNearbyDoctors } = require('./services/locationService');

    const lat = req.query.lat || 40.7128;
    const lng = req.query.lng || -74.0060;

    console.log(`🧪 TEST: Fetching nearby doctors for ${lat}, ${lng}`);

    const doctors = await getNearbyDoctors(lat, lng, 'General');

    res.status(200).json({
      success: true,
      coordinates: { lat, lng },
      doctorsFound: doctors.length,
      doctors: doctors,
    });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* =========================================================
   404 ROUTE HANDLER
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message:
      err.message ||
      'Internal Server Error',
  });
});

/* =========================================================
   START SERVER
========================================================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 MedCheck Server running on port ${PORT}`);
  // ✅ Verify env loaded correctly on startup
  console.log(`🔑 GROQ Key loaded: ${!!process.env.GROQ_API_KEY}`);
  console.log(`🗄️  MongoDB URI loaded: ${!!process.env.MONGO_URI}`);
});