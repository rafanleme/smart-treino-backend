import { Router } from 'express';
import { aiController } from './ai.controller';
import { authenticate } from '../../middlewares/auth';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

// All AI routes require authentication
router.use(authenticate);

// Generate workout
router.post('/generate-workout', asyncHandler(aiController.generateWorkout));

// Suggest progression
router.post('/suggest-progression', asyncHandler(aiController.suggestProgression));

export default router;
