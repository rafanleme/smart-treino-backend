import prisma from '../../config/database';
import { AppError } from '../../utils/errors';
import type {
  StoreTrainingSessionInput,
  UpdateTrainingSessionInput,
  UpdateSessionExerciseInput,
  StoreSessionSetInput,
  UpdateSessionSetInput,
  SessionQuery,
} from './session.schemas';
import { Prisma } from '@prisma/client';

export class SessionService {
  async findAllByUser(userId: number, query: SessionQuery) {
    const { status, date_from, date_to, per_page, page } = query;

    const where: Prisma.TrainingSessionWhereInput = { userId };

    if (status) {
      where.status = status;
    }

    if (date_from) {
      where.startedAt = {
        ...where.startedAt,
        gte: new Date(date_from),
      };
    }

    if (date_to) {
      where.startedAt = {
        ...where.startedAt,
        lte: new Date(date_to),
      };
    }

    const skip = (page - 1) * per_page;

    const [sessions, total] = await Promise.all([
      prisma.trainingSession.findMany({
        where,
        skip,
        take: per_page,
        orderBy: { startedAt: 'desc' },
        include: {
          exercises: {
            include: { sets: true },
            orderBy: { order: 'asc' },
          },
          _count: { select: { exercises: true } },
        },
      }),
      prisma.trainingSession.count({ where }),
    ]);

    // Calculate summary for each session
    const sessionsWithSummary = sessions.map((session) => ({
      ...session,
      summary: this.calculateSummary(session),
    }));

    return {
      data: sessionsWithSummary,
      meta: {
        currentPage: page,
        perPage: per_page,
        total,
        lastPage: Math.ceil(total / per_page),
      },
    };
  }

  async findById(id: number, userId: number) {
    const session = await prisma.trainingSession.findUnique({
      where: { id },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: { orderBy: { setNumber: 'asc' } },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!session) {
      throw new AppError('Training session not found', 404);
    }

    if (session.userId !== userId) {
      throw new AppError('Forbidden', 403);
    }

    return {
      ...session,
      summary: this.calculateSummary(session),
    };
  }

  async create(userId: number, data: StoreTrainingSessionInput) {
    // Verify workout exists and belongs to user
    const workout = await prisma.workout.findUnique({
      where: { id: data.workout_id },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!workout) {
      throw new AppError('Workout not found', 404);
    }

    if (workout.userId !== userId) {
      throw new AppError('Forbidden', 403);
    }

    // Create session
    const session = await prisma.trainingSession.create({
      data: {
        userId,
        workoutId: workout.id,
        workoutName: workout.name,
        startedAt: new Date(),
        status: 'in_progress',
      },
    });

    // Copy workout exercises to session exercises (snapshot)
    if (workout.exercises.length > 0) {
      await prisma.sessionExercise.createMany({
        data: workout.exercises.map((we) => ({
          trainingSessionId: session.id,
          exerciseId: we.exerciseId,
          exerciseName: we.exercise.namePt,
          order: we.order,
          targetSets: we.sets,
          targetReps: we.reps,
          status: 'pending',
        })),
      });
    }

    // Return session with exercises
    return prisma.trainingSession.findUnique({
      where: { id: session.id },
      include: {
        exercises: {
          include: { exercise: true, sets: true },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async update(id: number, userId: number, data: UpdateTrainingSessionInput) {
    // Check ownership
    const session = await this.findById(id, userId);

    const updateData: any = {};

    if (data.notes !== undefined) {
      updateData.notes = data.notes;
    }

    // Handle status changes
    if (data.status) {
      updateData.status = data.status;

      if (data.status === 'completed' && session.status !== 'completed') {
        const now = new Date();
        updateData.finishedAt = now;
        updateData.durationSeconds = Math.floor(
          (now.getTime() - new Date(session.startedAt).getTime()) / 1000
        );
      }
    }

    const updated = await prisma.trainingSession.update({
      where: { id },
      data: updateData,
      include: {
        exercises: {
          include: { exercise: true, sets: { orderBy: { setNumber: 'asc' } } },
          orderBy: { order: 'asc' },
        },
      },
    });

    return {
      ...updated,
      summary: this.calculateSummary(updated),
      statusChanged: data.status === 'completed',
    };
  }

  async delete(id: number, userId: number) {
    await this.findById(id, userId);

    await prisma.trainingSession.delete({
      where: { id },
    });
  }

  async getPreviousLoad(sessionId: number, exerciseId: number, userId: number) {
    // Verify session ownership
    await this.findById(sessionId, userId);

    // Find last completed session with this exercise
    const lastSession = await prisma.trainingSession.findFirst({
      where: {
        userId,
        status: 'completed',
        id: { not: sessionId },
        exercises: {
          some: { exerciseId },
        },
      },
      orderBy: { finishedAt: 'desc' },
      include: {
        exercises: {
          where: { exerciseId },
          include: {
            sets: {
              orderBy: { loadKg: 'desc' },
            },
          },
        },
      },
    });

    if (!lastSession || !lastSession.exercises.length) {
      return null;
    }

    const sessionExercise = lastSession.exercises[0];
    if (!sessionExercise.sets.length) {
      return null;
    }

    const heaviestSet = sessionExercise.sets[0];

    return {
      load_kg: heaviestSet.loadKg ? parseFloat(heaviestSet.loadKg.toString()) : null,
      reps: heaviestSet.repsCompleted,
      date: lastSession.finishedAt,
    };
  }

  // Session Exercise methods
  async updateExercise(
    sessionExerciseId: number,
    userId: number,
    data: UpdateSessionExerciseInput
  ) {
    const sessionExercise = await prisma.sessionExercise.findUnique({
      where: { id: sessionExerciseId },
      include: { session: true },
    });

    if (!sessionExercise) {
      throw new AppError('Session exercise not found', 404);
    }

    if (sessionExercise.session.userId !== userId) {
      throw new AppError('Forbidden', 403);
    }

    const updateData: any = {};

    if (data.status) {
      updateData.status = data.status;

      if (data.status === 'in_progress' && sessionExercise.status !== 'in_progress') {
        updateData.startedAt = new Date();
      }

      if (
        (data.status === 'completed' || data.status === 'skipped') &&
        sessionExercise.status !== 'completed' &&
        sessionExercise.status !== 'skipped'
      ) {
        updateData.finishedAt = new Date();
      }
    }

    const updated = await prisma.sessionExercise.update({
      where: { id: sessionExerciseId },
      data: updateData,
      include: {
        exercise: true,
        sets: { orderBy: { setNumber: 'asc' } },
      },
    });

    return updated;
  }

  // Session Set methods
  async addSet(sessionExerciseId: number, userId: number, data: StoreSessionSetInput) {
    const sessionExercise = await prisma.sessionExercise.findUnique({
      where: { id: sessionExerciseId },
      include: { session: true, sets: { orderBy: { setNumber: 'desc' } } },
    });

    if (!sessionExercise) {
      throw new AppError('Session exercise not found', 404);
    }

    if (sessionExercise.session.userId !== userId) {
      throw new AppError('Forbidden', 403);
    }

    // Auto-increment set number
    const lastSet = sessionExercise.sets[0];
    const setNumber = lastSet ? lastSet.setNumber + 1 : 1;

    const set = await prisma.sessionSet.create({
      data: {
        sessionExerciseId,
        setNumber,
        repsTarget: data.reps_target,
        repsCompleted: data.reps_completed,
        loadKg: data.load_kg,
        restSeconds: data.rest_seconds,
        rpe: data.rpe,
        completedAt: new Date(),
      },
    });

    return {
      set,
      exerciseId: sessionExercise.exerciseId,
    };
  }

  async updateSet(setId: number, userId: number, data: UpdateSessionSetInput) {
    const set = await prisma.sessionSet.findUnique({
      where: { id: setId },
      include: {
        sessionExercise: {
          include: { session: true },
        },
      },
    });

    if (!set) {
      throw new AppError('Session set not found', 404);
    }

    if (set.sessionExercise.session.userId !== userId) {
      throw new AppError('Forbidden', 403);
    }

    const updated = await prisma.sessionSet.update({
      where: { id: setId },
      data: {
        repsTarget: data.reps_target,
        repsCompleted: data.reps_completed,
        loadKg: data.load_kg,
        restSeconds: data.rest_seconds,
        rpe: data.rpe,
      },
    });

    return updated;
  }

  private calculateSummary(session: any) {
    const totalExercises = session.exercises?.length ?? 0;
    const completedExercises =
      session.exercises?.filter((e: any) => e.status === 'completed').length ?? 0;

    let totalSets = 0;
    let totalReps = 0;
    let totalVolumeKg = 0;

    session.exercises?.forEach((exercise: any) => {
      exercise.sets?.forEach((set: any) => {
        totalSets++;
        totalReps += set.repsCompleted ?? 0;
        const loadKg = set.loadKg ? parseFloat(set.loadKg.toString()) : 0;
        totalVolumeKg += loadKg * (set.repsCompleted ?? 0);
      });
    });

    // TODO: Count PRs (will be implemented with events)
    const personalRecords = 0;

    return {
      total_exercises: totalExercises,
      completed_exercises: completedExercises,
      total_sets: totalSets,
      total_reps: totalReps,
      total_volume_kg: Math.round(totalVolumeKg * 100) / 100,
      personal_records: personalRecords,
    };
  }
}
