import prisma from '../config/database';
import type { SessionCompletedPayload } from '../events/emitter';

/**
 * Update user streak when a session is completed
 */
export async function updateStreakListener(payload: SessionCompletedPayload) {
  try {
    const { userId } = payload;

    // Get or create streak record
    let streak = await prisma.userStreak.findUnique({
      where: { userId },
    });

    if (!streak) {
      streak = await prisma.userStreak.create({
        data: {
          userId,
          currentStreak: 0,
          longestStreak: 0,
        },
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActivityDate = streak.lastActivityDate
      ? new Date(streak.lastActivityDate)
      : null;

    if (lastActivityDate) {
      lastActivityDate.setHours(0, 0, 0, 0);
    }

    let newCurrentStreak = streak.currentStreak;

    if (!lastActivityDate) {
      // First activity ever
      newCurrentStreak = 1;
    } else {
      const daysDiff = Math.floor(
        (today.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 0) {
        // Same day - no change to streak
        return;
      } else if (daysDiff === 1) {
        // Consecutive day - increment streak
        newCurrentStreak = streak.currentStreak + 1;
      } else {
        // Streak broken - reset to 1
        newCurrentStreak = 1;
      }
    }

    const newLongestStreak = Math.max(streak.longestStreak, newCurrentStreak);

    await prisma.userStreak.update({
      where: { userId },
      data: {
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastActivityDate: today,
      },
    });

    console.log(`🔥 Streak updated! User ${userId}: ${newCurrentStreak} days`);
  } catch (error) {
    console.error('Error in updateStreakListener:', error);
  }
}
