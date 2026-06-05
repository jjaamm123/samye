// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

/**
 * Protects routes that require admin authentication.
 * Expects:  Authorization: Bearer <token>
 * On success: attaches req.admin = { id, email } and calls next()
 * On failure: returns 401 Unauthorized
 */
const protect = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorised — no token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    // Distinguish expired from invalid for better client-side UX
    const message = err.name === 'TokenExpiredError'
      ? 'Session expired — please log in again.'
      : 'Not authorised — invalid token.';
    return res.status(401).json({ message });
  }
};

module.exports = { protect };
