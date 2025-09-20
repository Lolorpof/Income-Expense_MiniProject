import type { TApiResponse } from "@/types/api.type";
import type { TCreatedEntryForDate } from "@/types/money.type";
import { backendURL } from "@/utils/fetchingEndpoint";

export const editListing = async (
  listingId: string,
  action: string,
  time: string,
  spentOrEarned: number
) => {
  const response: TApiResponse<TCreatedEntryForDate> = await (
    await fetch(`${backendURL}api/money/auth/edit/listing`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listingId,
        action,
        time,
        spentOrEarned: Number(spentOrEarned),
      }),
      credentials: "include",
    })
  ).json();

  return response;
};
