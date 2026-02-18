import { z } from 'zod';

// Measurement fields enum
export const measurementFieldEnum = z.enum([
  'weight_kg',
  'height_cm',
  'body_fat_pct',
  'chest_cm',
  'waist_cm',
  'hip_cm',
  'left_arm_cm',
  'right_arm_cm',
  'left_thigh_cm',
  'right_thigh_cm',
  'left_calf_cm',
  'right_calf_cm',
  'neck_cm',
  'shoulder_cm',
  'forearm_cm',
]);

// Store Assessment Schema
export const storeAssessmentSchema = z.object({
  assessed_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  weight_kg: z.number().min(0).max(999).optional().nullable(),
  height_cm: z.number().min(0).max(300).optional().nullable(),
  body_fat_pct: z.number().min(0).max(100).optional().nullable(),
  chest_cm: z.number().min(0).max(999).optional().nullable(),
  waist_cm: z.number().min(0).max(999).optional().nullable(),
  hip_cm: z.number().min(0).max(999).optional().nullable(),
  left_arm_cm: z.number().min(0).max(999).optional().nullable(),
  right_arm_cm: z.number().min(0).max(999).optional().nullable(),
  left_thigh_cm: z.number().min(0).max(999).optional().nullable(),
  right_thigh_cm: z.number().min(0).max(999).optional().nullable(),
  left_calf_cm: z.number().min(0).max(999).optional().nullable(),
  right_calf_cm: z.number().min(0).max(999).optional().nullable(),
  neck_cm: z.number().min(0).max(999).optional().nullable(),
  shoulder_cm: z.number().min(0).max(999).optional().nullable(),
  forearm_cm: z.number().min(0).max(999).optional().nullable(),
  notes: z.string().optional().nullable(),
});

// Update Assessment Schema (same as store)
export const updateAssessmentSchema = storeAssessmentSchema.partial();

// Compare Query Schema
export const compareQuerySchema = z.object({
  from: z.string().transform((val) => parseInt(val, 10)),
  to: z.string().transform((val) => parseInt(val, 10)),
});

// Progress Query Schema
export const progressQuerySchema = z.object({
  field: measurementFieldEnum,
  date_from: z.string().optional(),
  date_to: z.string().optional(),
});

// Types
export type StoreAssessmentInput = z.infer<typeof storeAssessmentSchema>;
export type UpdateAssessmentInput = z.infer<typeof updateAssessmentSchema>;
export type CompareQuery = z.infer<typeof compareQuerySchema>;
export type ProgressQuery = z.infer<typeof progressQuerySchema>;
