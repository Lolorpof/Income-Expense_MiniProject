import { queryOptions } from "@tanstack/react-query";
import { getCurrentUserRaw } from "../raws/getCurrentUserRaw";

export const getCurrentUser = queryOptions({
  queryKey: ["current", "user"],
  queryFn: getCurrentUserRaw,
  staleTime: 1000 * 60 * 10, // 10 mins
});
