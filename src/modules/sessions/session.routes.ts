import { Router } from 'express';
import { SessionController } from './session.controller';
import { authenticate } from '../../middlewares/auth';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
const sessionController = new SessionController();

// All routes require authentication
router.use(authenticate);

// Training Session CRUD (sessions resource)
router.get('/', asyncHandler(sessionController.index));
router.post('/', asyncHandler(sessionController.store));
router.get('/:id', asyncHandler(sessionController.show));
router.put('/:id', asyncHandler(sessionController.update));
router.delete('/:id', asyncHandler(sessionController.destroy));

// Previous load
router.post('/:id/previous-load/:exerciseId', asyncHandler(sessionController.previousLoad));

export default router;
