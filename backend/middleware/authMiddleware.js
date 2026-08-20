// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

/**
 * Protects routes that require admin authentication.
 * Expects:  Authorization: Bearer <token>
 * On success: attaches req.user and calls next()
 * On failure: returns 401 Unauthorized
 */
const protect = async (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  console.log('[Auth] req.headers.authorization received:', !!authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorised — no token provided.' });
  }

  const token = authHeader.split(' ')[1];

  if (!process.env.JWT_SECRET) {
    console.error('[Auth] JWT_SECRET is missing or not properly loaded!');
    return res.status(500).json({ message: 'Server configuration error.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[Auth] jwt.verify succeeded for ID:', decoded.id);

    const user = await AdminUser.findById(decoded.id).select('-password');
    console.log('[Auth] req.user evaluates to:', user);

    if (!user || !user.isAdmin) {
      console.log('[Auth] User not found or isAdmin is false');
      return res.status(401).json({ message: 'Not authorised — admin privileges required.' });
    }

    req.user = user;
    // Keep req.admin for backward compatibility with other routes if they use it
    req.admin = { id: user._id, email: user.email };
    
    next();
  } catch (err) {
    console.error('[Auth] jwt.verify failed:', err.message);
    const message = err.name === 'TokenExpiredError'
      ? 'Session expired — please log in again.'
      : 'Not authorised — invalid token.';
    return res.status(401).json({ message });
  }
};

module.exports = { protect };
