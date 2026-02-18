import prisma from '../../config/database';
import type { PersonalRecordsQuery } from './gamification.schemas';

export class GamificationService {
  // Achievements
  async getAllAchievements(userId: number) {
    const allAchievements = await prisma.achievement.findMany({
      orderBy: [{ category: 'asc' }, { thresholdValue: 'asc' }],
    });

    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
    });

    const userAchievementMap = new Map(
      userAchievements.map((ua) => [ua.achievementId, ua.unlockedAt])
    );

    return allAchievements.map((achievement) => ({
      ...achievement,
      unlockedAt: userAchievementMap.get(achievement.id) || null,
    }));
  }

  async getRecentAchievements(userId: number) {
    const recentUnlocks = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { unlockedAt: 'desc' },
      take: 10,
    });

    return recentUnlocks.map((ua) => ({
      ...ua.achievement,
      unlockedAt: ua.unlockedAt,
    }));
  }

  // Personal Records
  async getPersonalRecords(userId: number, query: PersonalRecordsQuery) {
    const where: any = { userId };

    if (query.exercise_id) {
      where.exerciseId = query.exercise_id;
    }

    const records = await prisma.personalRecord.findMany({
      where,
      include: { exercise: true },
      orderBy: { achievedAt: 'desc' },
    });

    return records;
  }

  async getExerciseHistory(userId: number, exerciseId: number) {
    const records = await prisma.personalRecord.findMany({
      where: { userId, exerciseId },
      include: { exercise: true },
      orderBy: { achievedAt: 'asc' },
    });

    return records;
  }

  // Streaks
  async getStreaks(userId: number) {
    let streak = await prisma.userStreak.findUnique({
      where: { userId },
    });

    if (!streak) {
      // Create if doesn't exist
      streak = await prisma.userStreak.create({
        data: {
          userId,
          currentStreak: 0,
          longestStreak: 0,
        },
      });
    }

    return streak;
  }

  // Dashboard Stats
  async getDashboardStats(userId: number) {
    // Total sessions
    const totalSessions = await prisma.trainingSession.count({
      where: { userId, status: 'completed' },
    });

    // Total duration in hours
    const durationResult = await prisma.trainingSession.aggregate({
      where: { userId, status: 'completed' },
      _sum: { durationSeconds: true },
    });
    const totalDurationHours = Math.round((durationResult._sum.durationSeconds || 0) / 36) / 100;

    // Total volume
    const volumeResult = await prisma.$queryRaw<Array<{ total: bigint | null }>>`
      SELECT SUM(ss.load_kg * ss.reps_completed) as total
      FROM session_sets ss
      JOIN session_exercises se ON ss.session_exercise_id = se.id
      JOIN training_sessions ts ON se.training_session_id = ts.id
      WHERE ts.user_id = ${userId} AND ts.status = 'completed'
    `;
    const totalVolumeKg = volumeResult[0]?.total
      ? Math.round(Number(volumeResult[0].total) * 100) / 100
      : 0;

    // Sessions this week
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const sessionsThisWeek = await prisma.trainingSession.count({
      where: {
        userId,
        status: 'completed',
        startedAt: { gte: weekStart },
      },
    });

    // Sessions this month
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const sessionsThisMonth = await prisma.trainingSession.count({
      where: {
        userId,
        status: 'completed',
        startedAt: { gte: monthStart },
      },
    });

    // Favorite exercise
    const favoriteResult = await prisma.$queryRaw<
      Array<{ id: number; name_pt: string; times_performed: bigint }>
    >`
      SELECT e.id, e.name_pt, COUNT(*) as times_performed
      FROM session_exercises se
      JOIN training_sessions ts ON se.training_session_id = ts.id
      JOIN exercises e ON se.exercise_id = e.id
      WHERE ts.user_id = ${userId} AND ts.status = 'completed'
      GROUP BY e.id, e.name_pt
      ORDER BY times_performed DESC
      LIMIT 1
    `;

    const favoriteExercise = favoriteResult[0]
      ? {
          id: favoriteResult[0].id,
          name_pt: favoriteResult[0].name_pt,
          times_performed: Number(favoriteResult[0].times_performed),
        }
      : null;

    // Current streak
    const streak = await prisma.userStreak.findUnique({
      where: { userId },
    });
    const currentStreak = streak?.currentStreak ?? 0;

    // XP and level
    const totalXp = await this.calculateTotalXp(userId);
    const level = this.calculateLevel(totalXp);
    const xpToNextLevel = this.calculateXpToNextLevel(level);

    // Recent PRs (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentPRs = await prisma.personalRecord.count({
      where: {
        userId,
        achievedAt: { gte: thirtyDaysAgo },
      },
    });

    // Weekly volume for last 8 weeks
    const weeklyVolume = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7 + weekStart.getDay()));
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const volumeResult = await prisma.$queryRaw<Array<{ volume: bigint | null }>>`
        SELECT SUM(ss.load_kg * ss.reps_completed) as volume
        FROM session_sets ss
        JOIN session_exercises se ON ss.session_exercise_id = se.id
        JOIN training_sessions ts ON se.training_session_id = ts.id
        WHERE ts.user_id = ${userId}
          AND ts.status = 'completed'
          AND ts.started_at BETWEEN ${weekStart} AND ${weekEnd}
      `;

      const volume = volumeResult[0]?.volume
        ? Math.round(Number(volumeResult[0].volume) * 100) / 100
        : 0;

      const year = weekStart.getFullYear();
      const weekNumber = Math.ceil(
        ((weekStart.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + 1) / 7
      );

      weeklyVolume.push({
        week: `${year}-W${weekNumber.toString().padStart(2, '0')}`,
        volume_kg: volume,
      });
    }

    return {
      total_sessions: totalSessions,
      total_duration_hours: totalDurationHours,
      total_volume_kg: totalVolumeKg,
      sessions_this_week: sessionsThisWeek,
      sessions_this_month: sessionsThisMonth,
      favorite_exercise: favoriteExercise,
      current_streak: currentStreak,
      total_xp: totalXp,
      level,
      xp_to_next_level: xpToNextLevel,
      recent_prs: recentPRs,
      weekly_volume: weeklyVolume,
    };
  }

  private async calculateTotalXp(userId: number): Promise<number> {
    // XP from achievements
    const achievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
    });
    const achievementXp = achievements.reduce((sum, ua) => sum + ua.achievement.xpReward, 0);

    // XP from sessions (25 XP each)
    const sessionsCount = await prisma.trainingSession.count({
      where: { userId, status: 'completed' },
    });

    // XP from assessments (15 XP each)
    const assessmentsCount = await prisma.physicalAssessment.count({
      where: { userId },
    });

    // XP from PRs (20 XP each)
    const prsCount = await prisma.personalRecord.count({
      where: { userId },
    });

    // XP from workouts created (10 XP each)
    const workoutsCount = await prisma.workout.count({
      where: { userId },
    });

    return (
      achievementXp +
      sessionsCount * 25 +
      assessmentsCount * 15 +
      prsCount * 20 +
      workoutsCount * 10
    );
  }

  private calculateLevel(totalXp: number): number {
    // Formula: XP needed = level * 100
    // Reverse: level = sqrt(2 * totalXp / 100)
    // Simplified for progressive levels
    let level = 1;
    let xpNeeded = 0;

    while (xpNeeded <= totalXp) {
      level++;
      xpNeeded += level * 100;
    }

    return level - 1;
  }

  private calculateXpToNextLevel(currentLevel: number): number {
    const xpForCurrentLevel = (currentLevel * (currentLevel + 1) * 100) / 2;
    const xpForNextLevel = ((currentLevel + 1) * (currentLevel + 2) * 100) / 2;
    return xpForNextLevel - xpForCurrentLevel;
  }
}
