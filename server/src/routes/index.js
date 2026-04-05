import { Router } from 'express';
import authRoutes from './auth.routes.js';
import resumeRoutes from './resume.routes.js';
import aiRoutes from './ai.routes.js';
import versionRoutes from './version.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/resumes', resumeRoutes);
router.use('/ai', aiRoutes);
router.use('/versions', versionRoutes);

export default router;