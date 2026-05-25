const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ─────────────────────────────────────────────
// Generate JWT Token
// ─────────────────────────────────────────────
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

// ─────────────────────────────────────────────
// Remove sensitive fields before sending user
// ─────────────────────────────────────────────
const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

// ─────────────────────────────────────────────
// REGISTER USER
// POST /api/auth/register
// ─────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required.',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    // Role validation - only patient role allowed
    if (role && role !== 'patient') {
      return res.status(400).json({
        success: false,
        message: 'Only patient registration is supported.',
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email.',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || 'patient',
    });

    // Generate token
    const token = generateToken(user._id);

    // Response
    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: sanitizeUser(user),
    });

  } catch (error) {
    console.error('[REGISTER ERROR]', error.message);

    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
    });
  }
};

// ─────────────────────────────────────────────
// LOGIN USER
// POST /api/auth/login
// ─────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Response
    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: sanitizeUser(user),
    });

  } catch (error) {
    console.error('[LOGIN ERROR]', error.message);

    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
    });
  }
};

// ─────────────────────────────────────────────
// GET CURRENT USER
// GET /api/auth/me
// Protected Route
// ─────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      user: sanitizeUser(user),
    });

  } catch (error) {
    console.error('[GET ME ERROR]', error.message);

    res.status(500).json({
      success: false,
      message: 'Server error.',
    });
  }
};

// ─────────────────────────────────────────────
// LOGOUT USER
// POST /api/auth/logout
// ─────────────────────────────────────────────
const logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logout successful.',
    });

  } catch (error) {
    console.error('[LOGOUT ERROR]', error.message);

    res.status(500).json({
      success: false,
      message: 'Server error.',
    });
  }
};

// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────
module.exports = {
  register,
  login,
  getMe,
  logout,
};