import { queryOptions } from "@tanstack/react-query";
import { getAllEntriesDateIdByUserIdRaw } from "../raws/getAllEntriesDateIdByUserIdRaw";

export const getAllEntriesDateIdByUserId = (userId: string) =>
  queryOptions({
    queryKey: ["allEntries", userId],
    queryFn: getAllEntriesDateIdByUserIdRaw,
    staleTime: 1000 * 60 * 2, // 2 mins
  });
