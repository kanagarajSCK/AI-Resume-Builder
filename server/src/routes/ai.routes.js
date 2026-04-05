import { Router } from 'express';
import {
  chat, generateBullets, generateSummary,
  atsScore, review, matchJob, skillGaps, getChatHistory,
} from '../controllers/ai.controller.js';
import authenticate from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/chat', chat);
router.post('/generate-bullets', generateBullets);
router.post('/generate-summary', generateSummary);
router.post('/ats-score', atsScore);
router.post('/review', review);
router.post('/match-job', matchJob);
router.post('/skill-gaps', skillGaps);
router.get('/chat-history/:resumeId', getChatHistory);

export default router;