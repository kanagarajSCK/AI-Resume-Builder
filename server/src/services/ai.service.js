import { generateContent } from '../config/gemini.config.js';
import * as prompts from '../constants/prompts.js';
import { analyzeKeywords } from '../utils/keywordAnalyzer.js';
import { checkFormatting } from '../utils/formatChecker.js';
import { calculateOverallScore } from '../utils/scoreCalculator.js';
import { runInterviewAgent } from './agent.service.js';

const parseJsonResponse = (text) => {
  try { return JSON.parse(text); } catch (e) { /* continue */ }

  let jsonStr = null;
  if (text.includes('```json')) {
    const start = text.indexOf('```json') + 7;
    const end = text.indexOf('```', start);
    if (end > start) jsonStr = text.slice(start, end).trim();
  } else if (text.includes('```')) {
    const start = text.indexOf('```') + 3;
    const end = text.indexOf('```', start);
    if (end > start) jsonStr = text.slice(start, end).trim();
  } else if (text.includes('{')) {
    const start = text.indexOf('{');
    let depth = 0;
    for (let i = start; i < text.length; i++) {
      if (text[i] === '{') depth++;
      else if (text[i] === '}') { depth--; if (depth === 0) { jsonStr = text.slice(start, i + 1); break; } }
    }
  }

  if (jsonStr) {
    try { return JSON.parse(jsonStr); } catch (e) { /* continue */ }
  }

  return { error: 'Failed to parse AI response', raw: text };
};

// Interview Agent — uses Gemini function calling for autonomous tool use
export const chatWithInterviewAgent = async (data) => {
  return runInterviewAgent(data);
};

export const generateBullets = async (data) => {
  const prompt = prompts.bulletWriterPrompt(data);
  const result = await generateContent(prompt);
  return parseJsonResponse(result);
};

export const generateSummary = async (data) => {
  const prompt = prompts.summaryWriterPrompt(data);
  const result = await generateContent(prompt);
  return parseJsonResponse(result);
};

export const getAtsScore = async (data) => {
  const sections = data.sections || {};
  const jobDescription = data.jobDescription || '';

  const resumeText = JSON.stringify(sections);
  const keywordResults = analyzeKeywords(resumeText, jobDescription);
  const formatResults = checkFormatting(sections);

  const algorithmicResults = {
    keywordMatch: keywordResults,
    formatting: formatResults.formatting || 0,
    sectionCompleteness: formatResults.sectionCompleteness || 0,
    quantification: formatResults.quantification || 0,
    actionVerbs: formatResults.actionVerbs || 0,
    length: formatResults.length || 0,
    contactInfo: formatResults.contactInfo || 0,
  };

  const prompt = prompts.atsScorerPrompt({ ...data, algorithmicResults });
  const result = await generateContent(prompt);
  const parsed = parseJsonResponse(result);

  if (parsed.breakdown) {
    const breakdown = parsed.breakdown;
    for (const metric of ['keywordMatch', 'formatting', 'sectionCompleteness', 'quantification', 'actionVerbs', 'length', 'contactInfo']) {
      const algoScore = metric === 'keywordMatch'
        ? (typeof algorithmicResults[metric] === 'object' ? algorithmicResults[metric].score : algorithmicResults[metric])
        : algorithmicResults[metric];
      if (typeof algoScore === 'number' && breakdown[metric] && typeof breakdown[metric] === 'object') {
        const aiScore = breakdown[metric].score || algoScore;
        breakdown[metric].score = Math.round((algoScore + aiScore) / 2);
      }
    }
    const scores = {};
    for (const [key, val] of Object.entries(breakdown)) {
      scores[key] = typeof val === 'object' ? (val.score || 0) : val;
    }
    parsed.overall = calculateOverallScore(scores);
  }

  return parsed;
};

export const reviewResume = async (data) => {
  const prompt = prompts.reviewerPrompt(data);
  const result = await generateContent(prompt);
  return parseJsonResponse(result);
};

export const matchJob = async (data) => {
  const prompt = prompts.matchJobPrompt(data);
  const result = await generateContent(prompt);
  return parseJsonResponse(result);
};

export const detectSkillGaps = async (data) => {
  const prompt = prompts.skillGapsPrompt(data);
  const result = await generateContent(prompt);
  return parseJsonResponse(result);
};

export const parseResume = async (data) => {
  const prompt = prompts.resumeParserPrompt(data.resumeText || '');
  const result = await generateContent(prompt);
  return parseJsonResponse(result);
};