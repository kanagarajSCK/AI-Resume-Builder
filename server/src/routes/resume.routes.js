import { Router } from 'express';
import {
  createResume, getResumes, getResume,
  updateResume, updateSection, updateTemplate, deleteResume, uploadResume,
} from '../controllers/resume.controller.js';
import authenticate from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/upload', upload.single('file'), uploadResume);
router.post('/', createResume);
router.get('/', getResumes);
router.get('/:id', getResume);
router.put('/:id', updateResume);
router.put('/:id/sections/:section', updateSection);
router.put('/:id/template', updateTemplate);
router.delete('/:id', deleteResume);

export default router;