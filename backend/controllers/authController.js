const User = require('../models/User');
const Otp = require('../models/Otp');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
    const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset Your MedCheck Password</title>
</head>
<body style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #334155; margin: 0; padding: 40px 20px;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05); border: 1px solid #e2e8f0;">
    <!-- Title -->
    <tr>
      <td style="padding: 32px 32px 20px 32px; text-align: center;">
        <h2 style="font-size: 24px; font-weight: 700; color: #0f172a; margin: 0;">Password Reset Request</h2>
      </td>
    </tr>
    
    <!-- Content Body -->
    <tr>
      <td style="padding: 0 32px; font-size: 15px; line-height: 1.6; color: #475569;">
        <p style="margin-top: 0;">Hello,</p>
        <p>We received a request to reset your password for your <strong>MedCheck</strong> account. Please use the verification code below to proceed with setting up a new password:</p>
      </td>
    </tr>
    
    <!-- OTP Code Display -->
    <tr>
      <td style="padding: 16px 32px; text-align: center;">
        <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 18px; display: inline-block; min-width: 200px;">
          <span style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #0ea5e9; display: block; line-height: 1;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #64748b; margin: 10px 0 0 0;">This code is valid for <strong>5 minutes</strong>.</p>
      </td>
    </tr>
    
    <!-- Security Warning Card -->
    <tr>
      <td style="padding: 12px 32px 24px 32px;">
        <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; color: #92400e; font-size: 13px; line-height: 1.5;">
          <strong style="display: block; font-size: 14px; margin-bottom: 4px; color: #b45309;">⚠️ Security Warning</strong>
          Never share this verification code with anyone. MedCheck support staff or representatives will never ask you for this OTP. If you did not request this password reset, please ignore this email or contact support if you suspect unauthorized access.
        </div>
      </td>
    </tr>
    
    <!-- Divider -->
    <tr>
      <td style="padding: 0 32px;">
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 0;" />
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="padding: 24px 32px 32px 32px; text-align: center; font-size: 12px; color: #94a3b8; line-height: 1.5;">
        <p style="margin: 0 0 8px 0;">This is an automated system email. Please do not reply directly to this mail.</p>
        <p style="margin: 0;">&copy; 2026 MedCheck. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await sendEmail(
      email,
      'MedCheck Password Reset OTP',
      `Your MedCheck OTP is: ${otp}`,
      emailHtml
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
// GOOGLE LOGIN
// POST /api/auth/google-login
// ─────────────────────────────────────────────
const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token is required.',
      });
    }

    let email, name;

    // Check if the token is a mock token (indicated by starting with 'mock_')
    if (idToken.startsWith('mock_')) {
      // Decode mock data from the token
      // Mock token format: mock_email_name
      const parts = idToken.split('_');
      email = parts[1] || 'mockuser@gmail.com';
      name = parts[2] || 'Google User';
    } else {
      // Real google login
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        email = payload.email;
        name = payload.name;
      } catch (err) {
        console.error('Google token verification failed:', err.message);
        return res.status(400).json({
          success: false,
          message: 'Invalid Google ID token.',
        });
      }
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Could not retrieve email from Google account.',
      });
    }

    // Check if user exists
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Create new user for google signup
      const randomPassword = Math.random().toString(36).slice(-10); // Generate random password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = await User.create({
        name: name || 'Google User',
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'patient', // Default role
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Google login successful.',
      token,
      user: sanitizeUser(user),
    });

  } catch (error) {
    console.error('[GOOGLE LOGIN ERROR]', error.message);
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
  googleLogin,
};