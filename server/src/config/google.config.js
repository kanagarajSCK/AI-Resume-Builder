// ============================================
// google.config.js - Google OAuth Configuration
// ============================================

import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // OAuth client setup (Express.js: OAuth Integration)

// Using async/await pattern (JS Essentials: Async/Await)
const verifyGoogleToken = async (credential) => {
  try {
    const ticket = await googleClient.verifyIdToken({ // Google token verification (Express.js: OAuth Integration)
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
  } catch (error) {
    console.error('Google token verification failed:', error.message);
    throw new Error('Invalid Google token');
  }
};

export { googleClient, verifyGoogleToken };
