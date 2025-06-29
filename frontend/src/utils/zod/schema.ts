import { z } from "zod";

export const AuthSchema = z.object({
  type: z.enum(["login", "signup"]).optional(),
});

export type TAuthSchema = z.infer<typeof AuthSchema>;
