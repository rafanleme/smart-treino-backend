import { z } from 'zod';

// Enums
export const muscleGroupEnum = z.enum([
  'chest',
  'back',
  'legs',
  'shoulders',
  'biceps',
  'triceps',
  'abs',
  'cardio',
  'glutes',
  'forearms',
  'calves',
]);

export const equipmentEnum = z.enum([
  'barbell',
  'dumbbell',
  'machine',
  'cable',
  'bodyweight',
  'kettlebell',
  'band',
  'other',
]);

export const difficultyEnum = z.enum(['beginner', 'intermediate', 'advanced']);

export const exerciseTypeEnum = z.enum(['strength', 'cardio', 'stretching', 'plyometrics']);

// Store Exercise Schema
export const storeExerciseSchema = z.object({
  name: z.string().min(1).max(255),
  namePt: z.string().min(1).max(255),
  description: z.string().optional().nullable(),
  descriptionPt: z.string().optional().nullable(),
  muscleGroup: muscleGroupEnum,
  secondaryMuscles: z.array(muscleGroupEnum).optional().nullable(),
  equipment: equipmentEnum,
  difficulty: difficultyEnum,
  exerciseType: exerciseTypeEnum,
  imageUrl: z.string().url().max(512).optional().nullable(),
});

// Update Exercise Schema (all fields optional)
export const updateExerciseSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  namePt: z.string().min(1).max(255).optional(),
  description: z.string().optional().nullable(),
  descriptionPt: z.string().optional().nullable(),
  muscleGroup: muscleGroupEnum.optional(),
  secondaryMuscles: z.array(muscleGroupEnum).optional().nullable(),
  equipment: equipmentEnum.optional(),
  difficulty: difficultyEnum.optional(),
  exerciseType: exerciseTypeEnum.optional(),
  imageUrl: z.string().url().max(512).optional().nullable(),
});

// Query params for index
export const exerciseQuerySchema = z.object({
  muscleGroup: muscleGroupEnum.optional(),
  equipment: equipmentEnum.optional(),
  difficulty: difficultyEnum.optional(),
  exerciseType: exerciseTypeEnum.optional(),
  search: z.string().optional(),
  includeCustom: z
    .string()
    .optional()
    .transform((val) => val !== 'false'),
  perPage: z
    .string()
    .optional()
    .transform((val) => Math.min(parseInt(val || '20', 10), 100)),
  page: z
    .string()
    .optional()
    .transform((val) => parseInt(val || '1', 10)),
});

// Types
export type StoreExerciseInput = z.infer<typeof storeExerciseSchema>;
export type UpdateExerciseInput = z.infer<typeof updateExerciseSchema>;
export type ExerciseQuery = z.infer<typeof exerciseQuerySchema>;
