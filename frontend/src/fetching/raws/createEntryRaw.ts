import type { TApiResponse } from "@/types/api.type";
import type { TIncExpDaily } from "@/types/money.type";
import { backendURL } from "@/utils/fetchingEndpoint";

export const createEntryRaw = async (date: string) => {
  const response: TApiResponse<TIncExpDaily> = await (
    await fetch(`${backendURL}api/money/auth/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
      credentials: "include",
    })
  ).json();

  return response;
};
