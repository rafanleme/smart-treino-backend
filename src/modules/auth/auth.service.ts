import prisma from '../../config/database';
import { NotFoundError } from '../../utils/errors';

export class AuthService {
  async getUserProfile(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        streak: true,
      },
    });

    if (!user) throw new NotFoundError('User not found');

    const totalXp = await this.calculateTotalXp(userId);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar_url: user.avatarUrl,
      created_at: user.createdAt,
      streak: {
        current: user.streak?.currentStreak ?? 0,
        longest: user.streak?.longestStreak ?? 0,
      },
      total_xp: totalXp,
    };
  }

  async updateProfile(userId: number, data: { name?: string }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    return this.getUserProfile(user.id);
  }

  private async calculateTotalXp(userId: number): Promise<number> {
    // XP from achievements
    const achievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
    });

    const achievementXp = achievements.reduce(
      (sum, ua) => sum + ua.achievement.xpReward,
      0
    );

    // XP from completed sessions (25 XP each)
    const sessionsCount = await prisma.trainingSession.count({
      where: { userId, status: 'completed' },
    });

    // XP from physical assessments (15 XP each)
    const assessmentsCount = await prisma.physicalAssessment.count({
      where: { userId },
    });

    // XP from personal records (20 XP each)
    const prsCount = await prisma.personalRecord.count({
      where: { userId },
    });

    // XP from created workouts (10 XP each)
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
}
