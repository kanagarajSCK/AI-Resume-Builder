// ============================================
// authService.js - Authentication API Calls
// ============================================
// Reference: fetch(), async/await - reference-javascript.md

import API from './api.js';

const unwrapResponse = (response) => response.data ?? response;

const register = async (name, email, password) => {
  const response = await API.post('/auth/register', { name, email, password });
  return unwrapResponse(response);
};

const emailLogin = async (email, password) => {
  const response = await API.post('/auth/login', { email, password });
  return unwrapResponse(response);
};

const googleLogin = async (credential) => {
  const response = await API.post('/auth/google', { credential });
  return unwrapResponse(response);
};

const getMe = async () => {
  const response = await API.get('/auth/me');
  return unwrapResponse(response);
};

const logout = async () => {
  const response = await API.post('/auth/logout');
  return response;
};

export { register, emailLogin, googleLogin, getMe, logout };
