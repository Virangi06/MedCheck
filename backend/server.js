require('dotenv/config');

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');

// ROUTES
const authRoutes = require('./routes/authRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const profileRoutes = require('./routes/profileRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const tipsRoutes = require('./routes/tipsRoutes');

const app = express();

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =========================================================
   API ROUTES
========================================================= */

app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/medicine', medicineRoutes);
app.use('/api/tips', tipsRoutes);


/* =========================================================
   HEALTH CHECK ROUTE
========================================================= */

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MedCheck API is running',
    env: {
      groqKeyLoaded: !!process.env.GROQ_API_KEY,
      mongoLoaded: !!process.env.MONGO_URI,
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
    const lng = req.query.lng || -74.006;
    const doctors = await getNearbyDoctors(lat, lng, 'General');
    res.status(200).json({
      success: true,
      coordinates: { lat, lng },
      doctorsFound: doctors.length,
      doctors,
    });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ success: false, message: error.message });
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
    message: err.message || 'Internal Server Error',
  });
});

/* =========================================================
   START SERVER — connect DB THEN start listening
   ✅ FIX: DB connection happens before server starts;
   if DB fails, process.exit(1) in connectDB stops the server.
========================================================= */

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Log env status before connecting
  console.log(`🔑 GROQ Key loaded: ${!!process.env.GROQ_API_KEY}`);
  console.log(`🗄️  MongoDB URI loaded: ${!!process.env.MONGO_URI}`);

  // Connect to MongoDB first
  await connectDB();

  // Only start listening after DB is connected
  app.listen(PORT, () => {
    console.log(`🚀 MedCheck Server running on port ${PORT}`);
  });
};

startServer();