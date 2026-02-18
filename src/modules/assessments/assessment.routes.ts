import { Router } from 'express';
import { AssessmentController } from './assessment.controller';
import { authenticate } from '../../middlewares/auth';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
const assessmentController = new AssessmentController();

// All assessment routes require authentication
router.use(authenticate);

// CRUD routes
router.get('/', asyncHandler(assessmentController.index));
router.post('/', asyncHandler(assessmentController.store));
router.get('/:id', asyncHandler(assessmentController.show));
router.put('/:id', asyncHandler(assessmentController.update));
router.delete('/:id', asyncHandler(assessmentController.destroy));

export default router;
