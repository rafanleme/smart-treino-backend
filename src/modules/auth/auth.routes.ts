import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticate } from '../../middlewares/auth';
import { refreshAuth } from '../../middlewares/refreshAuth';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
const authController = new AuthController();

// Public routes
router.get('/google/redirect', asyncHandler(authController.googleRedirect.bind(authController)));
router.post('/google', asyncHandler(authController.googleAuth.bind(authController)));

// Protected routes
router.get('/me', authenticate, asyncHandler(authController.me.bind(authController)));
router.put('/me', authenticate, asyncHandler(authController.updateMe.bind(authController)));
router.post('/refresh', refreshAuth, asyncHandler(authController.refresh.bind(authController)));
router.post('/logout', authenticate, asyncHandler(authController.logout.bind(authController)));

export default router;
