import prisma from '../config/database';
import type { SetLoggedPayload } from '../events/emitter';

/**
 * Detect and record Personal Records when a set is logged
 */
export async function detectPersonalRecordListener(payload: SetLoggedPayload) {
  try {
    const { setId, userId, exerciseId, loadKg, reps } = payload;

    // Only consider sets with both load and reps
    if (!loadKg || !reps || loadKg <= 0 || reps <= 0) {
      return;
    }

    // Get current PR for this exercise
    const currentPR = await prisma.personalRecord.findFirst({
      where: {
        userId,
        exerciseId,
      },
      orderBy: [{ loadKg: 'desc' }, { reps: 'desc' }],
    });

    let isNewPR = false;

    if (!currentPR) {
      // First time doing this exercise - it's a PR!
      isNewPR = true;
    } else {
      const currentLoad = parseFloat(currentPR.loadKg.toString());

      // New PR if:
      // 1. More weight with same or more reps
      // 2. Same weight with more reps
      if (loadKg > currentLoad) {
        isNewPR = true;
      } else if (loadKg === currentLoad && reps > currentPR.reps) {
        isNewPR = true;
      }
    }

    if (isNewPR) {
      // Get the session set to get achievedAt date
      const sessionSet = await prisma.sessionSet.findUnique({
        where: { id: setId },
        select: { completedAt: true },
      });

      await prisma.personalRecord.create({
        data: {
          userId,
          exerciseId,
          loadKg,
          reps,
          achievedAt: sessionSet?.completedAt || new Date(),
          sessionSetId: setId,
        },
      });

      console.log(`🏆 New PR detected! User ${userId}, Exercise ${exerciseId}: ${loadKg}kg x ${reps} reps`);
    }
  } catch (error) {
    console.error('Error in detectPersonalRecordListener:', error);
  }
}
