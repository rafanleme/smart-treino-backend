import { Router } from 'express';
import { WorkoutController } from './workout.controller';
import { authenticate } from '../../middlewares/auth';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
const workoutController = new WorkoutController();

// All workout routes require authentication
router.use(authenticate);

// Workout CRUD
router.get('/', asyncHandler(workoutController.index));
router.post('/', asyncHandler(workoutController.store));
router.get('/:id', asyncHandler(workoutController.show));
router.put('/:id', asyncHandler(workoutController.update));
router.delete('/:id', asyncHandler(workoutController.destroy));

// Duplicate workout
router.post('/:id/duplicate', asyncHandler(workoutController.duplicate));

// Workout exercises
router.post('/:id/exercises', asyncHandler(workoutController.addExercise));
router.put('/:id/exercises/:exerciseId', asyncHandler(workoutController.updateExercise));
router.delete('/:id/exercises/:exerciseId', asyncHandler(workoutController.deleteExercise));

// Reorder exercises
router.put('/:id/reorder', asyncHandler(workoutController.reorderExercises));

export default router;
