const User = require('../models/User');
const Otp = require('../models/Otp');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const sendEmail = require('../utils/sendEmail');

// ─────────────────────────────────────────────
// Generate JWT Token
// ─────────────────────────────────────────────
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_EXPIRES_IN || '7d',
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
    const {
      name,
      email,
      password,
      role,
    } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          'Name, email and password are required.',
      });
    }

    // Email validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message:
          'Please enter a valid email address.',
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          'Password must be at least 6 characters.',
      });
    }

    // Only patient registration allowed
    if (role && role !== 'patient') {
      return res.status(400).json({
        success: false,
        message:
          'Only patient registration is supported.',
      });
    }

    // Check existing user
    const existingUser =
      await User.findOne({
        email: email.toLowerCase(),
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          'User already exists with this email.',
      });
    }

    // Hash password
    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email:
        email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || 'patient',
    });

    // Generate token
    const token = generateToken(
      user._id
    );

    // Response
    res.status(201).json({
      success: true,
      message:
        'Account created successfully.',
      token,
      user: sanitizeUser(user),
    });

  } catch (error) {

    console.error(
      '[REGISTER ERROR]',
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        'Server error. Please try again.',
    });
  }
};

// ─────────────────────────────────────────────
// LOGIN USER
// POST /api/auth/login
// ─────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } =
      req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          'Email and password are required.',
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          'Invalid email or password.',
      });
    }

    // Compare password
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          'Invalid email or password.',
      });
    }

    // Generate token
    const token = generateToken(
      user._id
    );

    // Response
    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: sanitizeUser(user),
    });

  } catch (error) {

    console.error(
      '[LOGIN ERROR]',
      error.message
    );

    res.status(500).json({
      success: false,
      message: 'Server error.',
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

    const user =
      await User.findById(
        req.user.id
      );

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

    console.error(
      '[GET ME ERROR]',
      error.message
    );

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

    console.error(
      '[LOGOUT ERROR]',
      error.message
    );

    res.status(500).json({
      success: false,
      message: 'Server error.',
    });
  }
};

// ─────────────────────────────────────────────
// FORGOT PASSWORD
// POST /api/auth/forgot-password
// ─────────────────────────────────────────────
const forgotPassword = async (
  req,
  res
) => {
  try {

    const { email } = req.body;

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Remove old OTP
    await Otp.deleteMany({
      email,
    });

    // Save OTP
    await Otp.create({
      email:email.toLowerCase(),

      otp,

      expiresAt:
        new Date(
          Date.now() +
            5 * 60 * 1000
        ),
    });

    // Send Email
    await sendEmail(
      email,

      'MedCheck Password Reset OTP',

      `Your MedCheck OTP is: ${otp}`
    );

    res.status(200).json({
      success: true,
      message:
        'OTP sent successfully.',
    });

  } catch (error) {

    console.error(
      '[FORGOT PASSWORD ERROR]',
      error.message
    );

    res.status(500).json({
      success: false,
      message: 'Server error.',
    });
  }
};

// ─────────────────────────────────────────────
// VERIFY OTP
// POST /api/auth/verify-otp
// ─────────────────────────────────────────────
const verifyOtp = async (
  req,
  res
) => {
  try {

    const { email, otp } =
      req.body;

    // Check missing fields
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message:
          'Email and OTP are required.',
      });
    }

    // Find OTP
    const existingOtp =
      await Otp.findOne({
        email: email.toLowerCase(),

        otp: otp.toString(),
      });

    // Invalid OTP
    if (!existingOtp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP.',
      });
    }

    // Check Expiry
    if (
      existingOtp.expiresAt <
      new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired.',
      });
    }

    // Generate reset token signed with JWT_SECRET, valid for 15 minutes
    const resetToken = jwt.sign(
      { email: email.toLowerCase(), verified: true },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Success
    res.status(200).json({
      success: true,
      message: 'OTP verified successfully.',
      resetToken,
    });

  } catch (error) {

    console.error(
      '[VERIFY OTP ERROR]',
      error.message
    );

    res.status(500).json({
      success: false,
      message: 'Server error.',
    });
  }
};


// ─────────────────────────────────────────────
// RESET PASSWORD
// POST /api/auth/reset-password
// ─────────────────────────────────────────────
const resetPassword = async (
  req,
  res
) => {
  try {

    const {
      token,
      password,
    } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and password are required.',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token.',
      });
    }

    if (!decoded.verified || !decoded.email) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset token permissions.',
      });
    }

    const email = decoded.email;

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Hash password
    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(password, salt);

    // Update password
    user.password =
      hashedPassword;

    await user.save();

    // Delete OTP after reset
    await Otp.deleteMany({
      email,
    });

    res.status(200).json({
      success: true,
      message:
        'Password updated successfully.',
    });

  } catch (error) {

    console.error(
      '[RESET PASSWORD ERROR]',
      error.message
    );

    res.status(500).json({
      success: false,
      message: 'Server error.',
    });
  }
};

// ─────────────────────────────────────────────
// CHANGE PASSWORD (LOGGED IN)
// POST /api/auth/change-password
// Protected Route
// ─────────────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters.',
      });
    }

    // Find user by ID (from protect middleware)
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Check if current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect current password.',
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
    });

  } catch (error) {
    console.error('[CHANGE PASSWORD ERROR]', error.message);
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

  forgotPassword,
  verifyOtp,
  resetPassword,
  changePassword,
};