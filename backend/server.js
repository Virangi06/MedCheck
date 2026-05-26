const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');

// ROUTES
const authRoutes = require('./routes/authRoutes');
const analysisRoutes = require('./routes/analysisRoutes');

// Load environment variables
dotenv.config();

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
  });
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
  console.log(
    `🚀 MedCheck Server running on port ${PORT}`
  );
});