import prisma from '../config/database';
import type { SessionCompletedPayload, AssessmentCreatedPayload } from '../events/emitter';

/**
 * Check and unlock achievements
 */
export async function checkAchievementsListener(
  payload: SessionCompletedPayload | AssessmentCreatedPayload
) {
  try {
    const { userId } = payload;

    // Get all achievements that user hasn't unlocked yet
    const unlockedAchievementKeys = await prisma.userAchievement.findMany({
      where: { userId },
      select: { achievement: { select: { key: true } } },
    });

    const unlockedKeys = new Set(unlockedAchievementKeys.map((ua) => ua.achievement.key));

    const allAchievements = await prisma.achievement.findMany();

    // Check each achievement condition
    for (const achievement of allAchievements) {
      if (unlockedKeys.has(achievement.key)) {
        continue; // Already unlocked
      }

      const shouldUnlock = await checkAchievementCondition(userId, achievement.key);

      if (shouldUnlock) {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
            unlockedAt: new Date(),
          },
        });

        console.log(`🏆 Achievement unlocked! User ${userId}: ${achievement.key} (+${achievement.xpReward} XP)`);
      }
    }
  } catch (error) {
    console.error('Error in checkAchievementsListener:', error);
  }
}

async function checkAchievementCondition(userId: number, key: string): Promise<boolean> {
  try {
    // Consistency achievements (sessions)
    if (key === 'first_workout') {
      const count = await prisma.trainingSession.count({
        where: { userId, status: 'completed' },
      });
      return count >= 1;
    }

    if (key === 'sessions_5') {
      const count = await prisma.trainingSession.count({
        where: { userId, status: 'completed' },
      });
      return count >= 5;
    }

    if (key === 'sessions_10') {
      const count = await prisma.trainingSession.count({
        where: { userId, status: 'completed' },
      });
      return count >= 10;
    }

    if (key === 'sessions_25') {
      const count = await prisma.trainingSession.count({
        where: { userId, status: 'completed' },
      });
      return count >= 25;
    }

    if (key === 'sessions_50') {
      const count = await prisma.trainingSession.count({
        where: { userId, status: 'completed' },
      });
      return count >= 50;
    }

    if (key === 'sessions_100') {
      const count = await prisma.trainingSession.count({
        where: { userId, status: 'completed' },
      });
      return count >= 100;
    }

    if (key === 'sessions_250') {
      const count = await prisma.trainingSession.count({
        where: { userId, status: 'completed' },
      });
      return count >= 250;
    }

    // Streak achievements
    if (key.startsWith('streak_')) {
      const thresholdStr = key.split('_')[1];
      const threshold = parseInt(thresholdStr, 10);

      const streak = await prisma.userStreak.findUnique({
        where: { userId },
      });

      return (streak?.currentStreak ?? 0) >= threshold;
    }

    // PR achievements
    if (key === 'first_pr') {
      const count = await prisma.personalRecord.count({ where: { userId } });
      return count >= 1;
    }

    if (key === 'pr_5') {
      const count = await prisma.personalRecord.count({ where: { userId } });
      return count >= 5;
    }

    if (key === 'pr_15') {
      const count = await prisma.personalRecord.count({ where: { userId } });
      return count >= 15;
    }

    if (key === 'pr_50') {
      const count = await prisma.personalRecord.count({ where: { userId } });
      return count >= 50;
    }

    // Volume achievements (single session)
    if (key === 'volume_1000' || key === 'volume_5000' || key === 'volume_10000') {
      const threshold = parseInt(key.split('_')[1], 10);

      // Check if any completed session reached this volume
      const sessions = await prisma.trainingSession.findMany({
        where: { userId, status: 'completed' },
        include: {
          exercises: {
            include: { sets: true },
          },
        },
      });

      for (const session of sessions) {
        let volume = 0;
        session.exercises.forEach((ex) => {
          ex.sets.forEach((set) => {
            const loadKg = set.loadKg ? parseFloat(set.loadKg.toString()) : 0;
            volume += loadKg * (set.repsCompleted ?? 0);
          });
        });

        if (volume >= threshold) {
          return true;
        }
      }

      return false;
    }

    // Total lifetime volume
    if (key === 'total_volume_100k' || key === 'total_volume_1m') {
      const threshold = key === 'total_volume_100k' ? 100000 : 1000000;

      const sessions = await prisma.trainingSession.findMany({
        where: { userId, status: 'completed' },
        include: {
          exercises: {
            include: { sets: true },
          },
        },
      });

      let totalVolume = 0;
      sessions.forEach((session) => {
        session.exercises.forEach((ex) => {
          ex.sets.forEach((set) => {
            const loadKg = set.loadKg ? parseFloat(set.loadKg.toString()) : 0;
            totalVolume += loadKg * (set.repsCompleted ?? 0);
          });
        });
      });

      return totalVolume >= threshold;
    }

    // Assessment achievements
    if (key === 'first_assessment') {
      const count = await prisma.physicalAssessment.count({ where: { userId } });
      return count >= 1;
    }

    if (key === 'assessments_3') {
      const count = await prisma.physicalAssessment.count({ where: { userId } });
      return count >= 3;
    }

    if (key === 'assessments_6') {
      const count = await prisma.physicalAssessment.count({ where: { userId } });
      return count >= 6;
    }

    if (key === 'assessments_12') {
      const count = await prisma.physicalAssessment.count({ where: { userId } });
      return count >= 12;
    }

    // Milestone achievements
    if (key === 'first_custom_exercise') {
      const count = await prisma.exercise.count({
        where: { createdBy: userId, isCustom: true },
      });
      return count >= 1;
    }

    if (key === 'workout_variety_5') {
      const count = await prisma.workout.count({ where: { userId } });
      return count >= 5;
    }

    // More complex achievements can be added here
    // (early_bird, night_owl, weekend_warrior, etc.)

    return false;
  } catch (error) {
    console.error(`Error checking achievement ${key}:`, error);
    return false;
  }
}
