import { z } from 'zod';

// Query schemas
export const personalRecordsQuerySchema = z.object({
  exercise_id: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
});

export type PersonalRecordsQuery = z.infer<typeof personalRecordsQuerySchema>;
