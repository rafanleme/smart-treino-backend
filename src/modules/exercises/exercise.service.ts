import prisma from '../../config/database';
import { AppError } from '../../utils/errors';
import type { StoreExerciseInput, UpdateExerciseInput, ExerciseQuery } from './exercise.schemas';
import { Prisma } from '@prisma/client';

export class ExerciseService {
  async findAll(query: ExerciseQuery, userId?: number) {
    const { muscleGroup, equipment, difficulty, exerciseType, search, includeCustom, perPage, page } = query;

    const where: Prisma.ExerciseWhereInput = {};

    // Filters
    if (muscleGroup) {
      where.muscleGroup = muscleGroup;
    }

    if (equipment) {
      where.equipment = equipment;
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (exerciseType) {
      where.exerciseType = exerciseType;
    }

    // Search by name (MySQL collation utf8mb4_unicode_ci is case-insensitive by default)
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { namePt: { contains: search } },
      ];
    }

    // Include custom exercises
    if (!includeCustom) {
      where.isCustom = false;
    }

    // Pagination
    const skip = (page - 1) * perPage;
    const take = perPage;

    const [exercises, total] = await Promise.all([
      prisma.exercise.findMany({
        where,
        skip,
        take,
        orderBy: { name: 'asc' },
      }),
      prisma.exercise.count({ where }),
    ]);

    return {
      data: exercises,
      meta: {
        currentPage: page,
        perPage,
        total,
        lastPage: Math.ceil(total / perPage),
      },
    };
  }

  async findById(id: number) {
    const exercise = await prisma.exercise.findUnique({
      where: { id },
    });

    if (!exercise) {
      throw new AppError('Exercise not found', 404);
    }

    return exercise;
  }

  async create(userId: number, data: StoreExerciseInput) {
    const exercise = await prisma.exercise.create({
      data: {
        name: data.name,
        namePt: data.namePt,
        description: data.description,
        descriptionPt: data.descriptionPt,
        muscleGroup: data.muscleGroup,
        secondaryMuscles: data.secondaryMuscles || [],
        equipment: data.equipment,
        difficulty: data.difficulty,
        exerciseType: data.exerciseType,
        imageUrl: data.imageUrl,
        isCustom: true,
        createdBy: userId,
      },
    });

    return exercise;
  }

  async update(id: number, userId: number, data: UpdateExerciseInput) {
    // Check if exercise exists
    const exercise = await this.findById(id);

    // Check ownership (only custom exercises can be updated, and only by owner)
    if (!exercise.isCustom) {
      throw new AppError('Cannot update built-in exercises', 403);
    }

    if (exercise.createdBy !== userId) {
      throw new AppError('Forbidden: You can only update your own exercises', 403);
    }

    const updated = await prisma.exercise.update({
      where: { id },
      data: {
        name: data.name,
        namePt: data.namePt,
        description: data.description,
        descriptionPt: data.descriptionPt,
        muscleGroup: data.muscleGroup,
        secondaryMuscles: data.secondaryMuscles ?? undefined,
        equipment: data.equipment,
        difficulty: data.difficulty,
        exerciseType: data.exerciseType,
        imageUrl: data.imageUrl,
      },
    });

    return updated;
  }

  async delete(id: number, userId: number) {
    // Check if exercise exists
    const exercise = await this.findById(id);

    // Check ownership
    if (!exercise.isCustom) {
      throw new AppError('Cannot delete built-in exercises', 403);
    }

    if (exercise.createdBy !== userId) {
      throw new AppError('Forbidden: You can only delete your own exercises', 403);
    }

    await prisma.exercise.delete({
      where: { id },
    });
  }
}
