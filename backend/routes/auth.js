// backend/routes/auth.js
const express    = require('express');
const jwt        = require('jsonwebtoken');
const AdminUser  = require('../models/AdminUser');

const router = express.Router();

// ── Helpers ─────────────────────────────────────────────────
const signToken = (admin) =>
  jwt.sign(
    { id: admin._id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );

// ────────────────────────────────────────────────────────────
// POST /api/auth/login
// Body: { email, password }
// ────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic input validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Find admin
    const admin = await AdminUser.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      // Deliberate vague message — do not reveal whether email exists
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Verify password
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Issue token
    const token = signToken(admin);

    return res.status(200).json({
      token,
      admin: { id: admin._id, email: admin.email },
      expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error during login.' });
  }
});

// ────────────────────────────────────────────────────────────
// POST /api/auth/register  (one-time use — disable in production)
// Creates the initial admin account. Remove or gate this after setup.
// ────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  // Guard: only allow if no admin exists yet
  const existingCount = await AdminUser.countDocuments();
  if (existingCount > 0) {
    return res.status(403).json({ message: 'Registration closed — an admin account already exists.' });
  }

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    const admin = await AdminUser.create({ email, password });
    const token  = signToken(admin);

    return res.status(201).json({
      message: 'Admin account created successfully.',
      token,
      admin: { id: admin._id, email: admin.email },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'An admin with that email already exists.' });
    }
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error during registration.' });
  }
});

module.exports = router;
