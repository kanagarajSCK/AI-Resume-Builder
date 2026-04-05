// ============================================
// aiService.js - AI API Calls
// ============================================
// Reference: fetch(), async/await - reference-javascript.md

import API from './api.js';

const unwrapResponse = (response) => response.data?.data ?? response.data;

const chatWithAgent = async (resumeId, message, sectionTargeted = '') => {
  const response = await API.post('/ai/chat', { resumeId, message, sectionTargeted });
  return unwrapResponse(response);
};

const generateBullets = async (data) => {
  const response = await API.post('/ai/generate-bullets', data);
  return unwrapResponse(response);
};

const generateSummary = async (resumeId) => {
  const response = await API.post('/ai/generate-summary', { resumeId });
  return unwrapResponse(response);
};

const getAtsScore = async (resumeId, jobDescription) => {
  const response = await API.post('/ai/ats-score', { resumeId, jobDescription });
  return unwrapResponse(response);
};

const reviewResume = async (resumeId) => {
  const response = await API.post('/ai/review', { resumeId });
  return unwrapResponse(response);
};

const matchJob = async (resumeId, jobDescription) => {
  const response = await API.post('/ai/match-job', { resumeId, jobDescription });
  return unwrapResponse(response);
};

const detectSkillGaps = async (resumeId, jobDescription) => {
  const response = await API.post('/ai/skill-gaps', { resumeId, jobDescription });
  return unwrapResponse(response);
};

const getChatHistory = async (resumeId) => {
  const response = await API.get(`/ai/chat-history/${resumeId}`);
  return unwrapResponse(response);
};

export {
  chatWithAgent, generateBullets, generateSummary,
  getAtsScore, reviewResume, matchJob, detectSkillGaps, getChatHistory,
};
