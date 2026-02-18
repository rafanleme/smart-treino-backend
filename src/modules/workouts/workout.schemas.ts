import { z } from 'zod';

// Store Workout Schema
export const storeWorkoutSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional().nullable(),
  estimated_duration_min: z.number().int().min(1).optional().nullable(),
});

// Update Workout Schema
export const updateWorkoutSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional().nullable(),
  estimated_duration_min: z.number().int().min(1).optional().nullable(),
});

// Store Workout Exercise Schema
export const storeWorkoutExerciseSchema = z.object({
  exercise_id: z.number().int().positive(),
  sets: z.number().int().min(1).default(3),
  reps: z.string().default('12'),
  rest_seconds: z.number().int().min(0).default(60),
  notes: z.string().optional().nullable(),
});

// Update Workout Exercise Schema
export const updateWorkoutExerciseSchema = z.object({
  sets: z.number().int().min(1).optional(),
  reps: z.string().optional(),
  rest_seconds: z.number().int().min(0).optional(),
  notes: z.string().optional().nullable(),
});

// Reorder Workout Exercises Schema
export const reorderWorkoutExercisesSchema = z.object({
  exercises: z.array(
    z.object({
      workout_exercise_id: z.number().int().positive(),
      order: z.number().int().min(0),
    })
  ),
});

// Types
export type StoreWorkoutInput = z.infer<typeof storeWorkoutSchema>;
export type UpdateWorkoutInput = z.infer<typeof updateWorkoutSchema>;
export type StoreWorkoutExerciseInput = z.infer<typeof storeWorkoutExerciseSchema>;
export type UpdateWorkoutExerciseInput = z.infer<typeof updateWorkoutExerciseSchema>;
export type ReorderWorkoutExercisesInput = z.infer<typeof reorderWorkoutExercisesSchema>;
