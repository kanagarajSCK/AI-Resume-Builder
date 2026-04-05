// ============================================
// User.model.js - User Database Schema
// ============================================
// Users can sign in via Google OAuth or email/password.
// ============================================

import mongoose from 'mongoose';

// Mongoose schema definition (MongoDB: Schema Design)
const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    password: {
      type: String,
    },
    picture: {
      type: String,
      default: '',
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Auto-generates createdAt and updatedAt (MongoDB: Schema Design)
  }
);

const User = mongoose.model('User', userSchema); // Mongoose model creation (MongoDB: Models)

export default User;
