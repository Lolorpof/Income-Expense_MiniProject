import { z } from "zod";

export const AuthSchema = z.object({
  type: z.enum(["login", "signup"]).optional(),
});

export type TAuthSchema = z.infer<typeof AuthSchema>;

export const ListingSchema = z.object({
  action: z.string().min(3, "action needs to be at least 3 character long"),
  time: z
    .string()
    .regex(
      /^\d{2}:\d{2}$/,
      "time isn't in format XX:XX where X is a digit of number"
    ),
  spentOrEarned: z.number().refine((arg) => arg !== 0, "Amount shouldn't be 0"),
  moneyDailyId: z.string(),
});

export type TListingSchema = z.infer<typeof ListingSchema>;
