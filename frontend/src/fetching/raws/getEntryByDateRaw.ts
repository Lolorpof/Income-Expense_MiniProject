import type { TApiResponse } from "@/types/api.type";
import type { TIncExpDaily, TListingEntriesComb } from "@/types/money.type";
import { backendURL } from "@/utils/fetchingEndpoint";

export const getEntryByDateRaw = async (date: string) => {
  const response: TApiResponse<TListingEntriesComb> = await (
    await fetch(`${backendURL}api/money/auth/get/${date}`, {
      method: "GET",
      credentials: "include",
    })
  ).json();

  return response;
};
