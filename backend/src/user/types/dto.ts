import { z } from 'zod';

// register
export const registerUserSchema = z.object({
  username: z.string().min(3).max(8),
  password: z.string().min(6).max(24),
});
export type registerUserDto = z.infer<typeof registerUserSchema>;
