import { createFileRoute } from "@tanstack/react-router";
import { AuthSchema } from "../../utils/zod/schema";

export const Route = createFileRoute("/auth/")({
  validateSearch: AuthSchema,
});
