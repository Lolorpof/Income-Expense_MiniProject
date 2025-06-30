import { z } from 'zod';

export const createIncExpDailySchema = z.object({
  date: z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) {
      return new Date(arg);
    }
    return arg;
  }, z.date()),
});

export type createIncExpDailyDto = z.infer<typeof createIncExpDailySchema>;
