import { z } from 'zod';

export const googleAuthSchema = z
  .object({
    code: z.string().min(1, 'Authorization code is required'),
    redirect_uri: z.string().url('Redirect URI must be a valid URL').optional(),
    redirectUri: z.string().url('Redirect URI must be a valid URL').optional(),
  })
  .transform((data) => ({
    code: data.code,
    redirectUri: data.redirect_uri || data.redirectUri || '',
  }));

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty').optional(),
});

export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
