import type { TApiResponse } from "@/types/api.type";
import type { TIncExpDateId } from "@/types/money.type";
import { backendURL } from "@/utils/fetchingEndpoint";

export const getAllEntriesDateIdByUserIdRaw = async () => {
  const response: TApiResponse<TIncExpDateId[]> = await (
    await fetch(`${backendURL}api/money/auth/getAll`, {
      method: "GET",
      credentials: "include",
    })
  ).json();

  return response;
};
