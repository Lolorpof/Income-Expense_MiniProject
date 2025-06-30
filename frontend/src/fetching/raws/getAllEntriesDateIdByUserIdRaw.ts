import type { TApiResponse } from "@/types/api.type";
import type { TIncExpDateId } from "@/types/money.type";

export const getAllEntriesDateIdByUserIdRaw = async () => {
  const response: TApiResponse<TIncExpDateId[]> = await (
    await fetch("http://localhost:6900/api/money/auth/getAll", {
      method: "GET",
      credentials: "include",
    })
  ).json();

  return response;
};
