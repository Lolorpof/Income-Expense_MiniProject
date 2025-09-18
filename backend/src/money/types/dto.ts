import { z } from 'zod';

export const createIncExpDailySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'input must be in YYYY-MM-DD format'),
});

export type createIncExpDailyDto = z.infer<typeof createIncExpDailySchema>;

export const createIncExpListingSchema = z.object({
  moneyDailyId: z.string(),
  time: z.string(),
  action: z.string(),
  spentOrEarned: z.number(),
});

export type createIncExpListingDto = z.infer<typeof createIncExpListingSchema>;
