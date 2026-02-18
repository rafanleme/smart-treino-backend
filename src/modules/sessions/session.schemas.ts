import { z } from 'zod';

// Enums
export const sessionStatusEnum = z.enum(['in_progress', 'completed', 'abandoned']);
export const exerciseStatusEnum = z.enum(['pending', 'in_progress', 'completed', 'skipped']);

// Store Training Session Schema
export const storeTrainingSessionSchema = z.object({
  workout_id: z.number().int().positive(),
});

// Update Training Session Schema
export const updateTrainingSessionSchema = z.object({
  status: sessionStatusEnum.optional(),
  notes: z.string().optional().nullable(),
});

// Update Session Exercise Schema
export const updateSessionExerciseSchema = z.object({
  status: exerciseStatusEnum.optional(),
});

// Store Session Set Schema
export const storeSessionSetSchema = z.object({
  reps_target: z.number().int().min(0).optional().nullable(),
  reps_completed: z.number().int().min(0).optional().nullable(),
  load_kg: z.number().min(0).optional().nullable(),
  rest_seconds: z.number().int().min(0).optional().nullable(),
  rpe: z.number().int().min(1).max(10).optional().nullable(),
});

// Update Session Set Schema
export const updateSessionSetSchema = z.object({
  reps_target: z.number().int().min(0).optional().nullable(),
  reps_completed: z.number().int().min(0).optional().nullable(),
  load_kg: z.number().min(0).optional().nullable(),
  rest_seconds: z.number().int().min(0).optional().nullable(),
  rpe: z.number().int().min(1).max(10).optional().nullable(),
});

// Query params for index
export const sessionQuerySchema = z.object({
  status: sessionStatusEnum.optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  per_page: z
    .string()
    .optional()
    .transform((val) => Math.min(parseInt(val || '20', 10), 100)),
  page: z
    .string()
    .optional()
    .transform((val) => parseInt(val || '1', 10)),
});

// Types
export type StoreTrainingSessionInput = z.infer<typeof storeTrainingSessionSchema>;
export type UpdateTrainingSessionInput = z.infer<typeof updateTrainingSessionSchema>;
export type UpdateSessionExerciseInput = z.infer<typeof updateSessionExerciseSchema>;
export type StoreSessionSetInput = z.infer<typeof storeSessionSetSchema>;
export type UpdateSessionSetInput = z.infer<typeof updateSessionSetSchema>;
export type SessionQuery = z.infer<typeof sessionQuerySchema>;
