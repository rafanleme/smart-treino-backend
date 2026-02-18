import { Router } from 'express';
import { ExerciseController } from './exercise.controller';
import { authenticate } from '../../middlewares/auth';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
const exerciseController = new ExerciseController();

// Public routes (can view exercises without auth)
router.get('/', asyncHandler(exerciseController.index));
router.get('/:id', asyncHandler(exerciseController.show));

// Protected routes (require authentication)
router.post('/', authenticate, asyncHandler(exerciseController.store));
router.put('/:id', authenticate, asyncHandler(exerciseController.update));
router.delete('/:id', authenticate, asyncHandler(exerciseController.destroy));

export default router;
