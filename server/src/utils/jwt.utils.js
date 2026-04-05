// ============================================
// jwt.utils.js - JWT Token Utilities
// ============================================

import jwt from 'jsonwebtoken';

// JWT sign and verify (Express.js: JWT Utilities)
export const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { // JWT token generation (Express.js: Authentication)
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET); // JWT token verification (Express.js: Authentication)
};
