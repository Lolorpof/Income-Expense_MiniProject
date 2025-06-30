import { queryOptions } from "@tanstack/react-query";
import { getAllEntriesDateIdByUserIdRaw } from "../raws/getAllEntriesDateIdByUserIdRaw";

export const getAllEntriesDateIdByUserId = queryOptions({
  queryKey: ["allEntries", "user"],
  queryFn: getAllEntriesDateIdByUserIdRaw,
  staleTime: 1000 * 60 * 2, // 2 mins
});
