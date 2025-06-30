import type { TApiResponse } from "@/types/api.type";
import type { TIncExpDaily } from "@/types/money.type";

export const createEntryRaw = async (date: Date) => {
  const response: TApiResponse<TIncExpDaily> = await (
    await fetch("http://localhost:6900/api/money/auth/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
      credentials: "include",
    })
  ).json();

  return response;
};
