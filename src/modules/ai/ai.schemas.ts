import { z } from 'zod';

export const generateWorkoutSchema = z.object({
  goal: z.enum(['hypertrophy', 'strength', 'endurance']),
  muscle_groups: z.array(z.string()).optional(),
  duration_minutes: z.number().int().min(15).max(180).optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  notes: z.string().optional(),
});

export const suggestProgressionSchema = z.object({
  exercise_id: z.number().int().positive(),
});

export type GenerateWorkoutInput = z.infer<typeof generateWorkoutSchema>;
export type SuggestProgressionInput = z.infer<typeof suggestProgressionSchema>;
