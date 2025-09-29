import { queryOptions } from "@tanstack/react-query";
import { getEntryByDateRaw } from "../raws/getEntryByDateRaw";

export const getEntryByDate = (date: string) =>
  queryOptions({
    queryKey: ["entry", date],
    queryFn: () => getEntryByDateRaw(date),
  });
