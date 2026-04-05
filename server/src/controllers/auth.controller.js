// ============================================
// auth.controller.js - Auth Controller
// ============================================
// Handles HTTP requests for authentication.
// Flow: Route -> Controller -> Service -> Database
// ============================================

import * as authService from '../services/auth.service.js';

// Express POST route handler (Express.js: HTTP Methods)
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body; // Destructuring request body (JS Essentials: Destructuring)

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const result = await authService.register(name, email, password); // Using async/await pattern (JS Essentials: Async/Await)
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ success: false, message: error.message });
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body; // Destructuring request body (JS Essentials: Destructuring)

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const result = await authService.emailLogin(email, password);
    return res.json({ success: true, data: result });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ success: false, message: error.message });
    next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential is required.' });
    }

    const result = await authService.googleLogin(credential);
    return res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getUserProfile(req.user._id);
    return res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    return res.json({ success: true, data: { message: 'Logged out successfully' } });
  } catch (error) {
    next(error);
  }
};
