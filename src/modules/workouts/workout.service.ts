import prisma from '../../config/database';
import { AppError } from '../../utils/errors';
import type {
  StoreWorkoutInput,
  UpdateWorkoutInput,
  StoreWorkoutExerciseInput,
  UpdateWorkoutExerciseInput,
  ReorderWorkoutExercisesInput,
} from './workout.schemas';

export class WorkoutService {
  async findAllByUser(userId: number) {
    const workouts = await prisma.workout.findMany({
      where: { userId },
      include: {
        _count: {
          select: { exercises: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return workouts;
  }

  async findById(id: number, userId: number) {
    const workout = await prisma.workout.findUnique({
      where: { id },
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

    // Check ownership
    if (workout.userId !== userId) {
      throw new AppError('Forbidden', 403);
    }

    return workout;
  }

  async create(userId: number, data: StoreWorkoutInput) {
    const workout = await prisma.workout.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        estimatedDurationMin: data.estimated_duration_min,
        isAiGenerated: false,
      },
    });

    return workout;
  }

  async update(id: number, userId: number, data: UpdateWorkoutInput) {
    // Check ownership
    await this.findById(id, userId);

    const workout = await prisma.workout.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        estimatedDurationMin: data.estimated_duration_min,
      },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    return workout;
  }

  async delete(id: number, userId: number) {
    // Check ownership
    await this.findById(id, userId);

    await prisma.workout.delete({
      where: { id },
    });
  }

  async duplicate(id: number, userId: number) {
    // Get original workout with exercises
    const originalWorkout = await this.findById(id, userId);

    // Create new workout
    const newWorkout = await prisma.workout.create({
      data: {
        userId,
        name: `${originalWorkout.name} (Cópia)`,
        description: originalWorkout.description,
        estimatedDurationMin: originalWorkout.estimatedDurationMin,
        isAiGenerated: false,
      },
    });

    // Copy exercises
    if (originalWorkout.exercises.length > 0) {
      await prisma.workoutExercise.createMany({
        data: originalWorkout.exercises.map((we) => ({
          workoutId: newWorkout.id,
          exerciseId: we.exerciseId,
          order: we.order,
          sets: we.sets,
          reps: we.reps,
          restSeconds: we.restSeconds,
          notes: we.notes,
        })),
      });
    }

    // Return with exercises
    return prisma.workout.findUnique({
      where: { id: newWorkout.id },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  // Workout Exercises methods
  async addExercise(workoutId: number, userId: number, data: StoreWorkoutExerciseInput) {
    // Check workout ownership
    await this.findById(workoutId, userId);

    // Get max order
    const maxOrder = await prisma.workoutExercise.aggregate({
      where: { workoutId },
      _max: { order: true },
    });

    const nextOrder = (maxOrder._max.order ?? -1) + 1;

    const workoutExercise = await prisma.workoutExercise.create({
      data: {
        workoutId,
        exerciseId: data.exercise_id,
        order: nextOrder,
        sets: data.sets,
        reps: data.reps,
        restSeconds: data.rest_seconds,
        notes: data.notes,
      },
      include: { exercise: true },
    });

    return workoutExercise;
  }

  async updateExercise(
    workoutId: number,
    workoutExerciseId: number,
    userId: number,
    data: UpdateWorkoutExerciseInput
  ) {
    // Check workout ownership
    await this.findById(workoutId, userId);

    // Check that exercise belongs to this workout
    const workoutExercise = await prisma.workoutExercise.findUnique({
      where: { id: workoutExerciseId },
    });

    if (!workoutExercise || workoutExercise.workoutId !== workoutId) {
      throw new AppError('Workout exercise not found', 404);
    }

    const updated = await prisma.workoutExercise.update({
      where: { id: workoutExerciseId },
      data: {
        sets: data.sets,
        reps: data.reps,
        restSeconds: data.rest_seconds,
        notes: data.notes,
      },
      include: { exercise: true },
    });

    return updated;
  }

  async deleteExercise(workoutId: number, workoutExerciseId: number, userId: number) {
    // Check workout ownership
    await this.findById(workoutId, userId);

    // Check that exercise belongs to this workout
    const workoutExercise = await prisma.workoutExercise.findUnique({
      where: { id: workoutExerciseId },
    });

    if (!workoutExercise || workoutExercise.workoutId !== workoutId) {
      throw new AppError('Workout exercise not found', 404);
    }

    await prisma.workoutExercise.delete({
      where: { id: workoutExerciseId },
    });
  }

  async reorderExercises(workoutId: number, userId: number, data: ReorderWorkoutExercisesInput) {
    // Check workout ownership
    await this.findById(workoutId, userId);

    // Update orders in a transaction
    await prisma.$transaction(
      data.exercises.map((item) =>
        prisma.workoutExercise.update({
          where: {
            id: item.workout_exercise_id,
            workoutId, // Ensure it belongs to this workout
          },
          data: { order: item.order },
        })
      )
    );
  }
}
