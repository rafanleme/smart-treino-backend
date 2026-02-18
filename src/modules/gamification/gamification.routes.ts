import { Router } from 'express';
import { GamificationController } from './gamification.controller';
import { authenticate } from '../../middlewares/auth';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
const gamificationController = new GamificationController();

// All routes require authentication
router.use(authenticate);

// Achievements
router.get('/achievements', asyncHandler(gamificationController.getAllAchievements));
router.get('/achievements/recent', asyncHandler(gamificationController.getRecentAchievements));

// Personal Records
router.get('/personal-records', asyncHandler(gamificationController.getPersonalRecords));
router.get(
  '/personal-records/exercise/:exerciseId',
  asyncHandler(gamificationController.getExerciseHistory)
);

// Streaks
router.get('/streaks', asyncHandler(gamificationController.getStreaks));

// Dashboard Stats
router.get('/stats/dashboard', asyncHandler(gamificationController.getDashboardStats));

export default router;
