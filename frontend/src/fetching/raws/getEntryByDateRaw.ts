import type { TApiResponse } from "@/types/api.type";
import type { TIncExpDaily } from "@/types/money.type";

export const getEntryByDateRaw = async (date: string) => {
  const response: TApiResponse<TIncExpDaily> = await (
    await fetch(`http://localhost:6900/api/money/auth/get/${date}`, {
      method: "GET",
      credentials: "include",
    })
  ).json();

  return response;
};
