import type { Request, Response } from 'express';
import { GamificationService } from './gamification.service';
import { personalRecordsQuerySchema } from './gamification.schemas';
import {
  transformAchievement,
  transformPersonalRecord,
  transformUserStreak,
} from '../../utils/transformers';
import { parseIntParam } from '../../utils/helpers';

const gamificationService = new GamificationService();

export class GamificationController {
  // Achievements
  async getAllAchievements(req: Request, res: Response) {
    const userId = req.user!.id;
    const achievements = await gamificationService.getAllAchievements(userId);

    res.json({
      data: achievements.map(transformAchievement),
    });
  }

  async getRecentAchievements(req: Request, res: Response) {
    const userId = req.user!.id;
    const achievements = await gamificationService.getRecentAchievements(userId);

    res.json({
      data: achievements.map(transformAchievement),
    });
  }

  // Personal Records
  async getPersonalRecords(req: Request, res: Response) {
    const userId = req.user!.id;
    const query = personalRecordsQuerySchema.parse(req.query);
    const records = await gamificationService.getPersonalRecords(userId, query);

    res.json({
      data: records.map(transformPersonalRecord),
    });
  }

  async getExerciseHistory(req: Request, res: Response) {
    const userId = req.user!.id;
    const exerciseId = parseIntParam(req.params.exerciseId);

    const records = await gamificationService.getExerciseHistory(userId, exerciseId);

    res.json({
      data: records.map(transformPersonalRecord),
    });
  }

  // Streaks
  async getStreaks(req: Request, res: Response) {
    const userId = req.user!.id;
    const streak = await gamificationService.getStreaks(userId);

    res.json({
      data: transformUserStreak(streak),
    });
  }

  // Dashboard Stats
  async getDashboardStats(req: Request, res: Response) {
    const userId = req.user!.id;
    const stats = await gamificationService.getDashboardStats(userId);

    res.json({
      data: stats,
    });
  }
}
