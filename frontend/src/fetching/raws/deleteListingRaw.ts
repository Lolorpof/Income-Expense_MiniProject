import type { TApiResponse } from "@/types/api.type";
import type { TDeletedListing } from "@/types/money.type";
import { backendURL } from "@/utils/fetchingEndpoint";

export const deleteListing = async (listingId: string) => {
  // Type also for deleting
  const response: TApiResponse<TDeletedListing> = await (
    await fetch(`${backendURL}api/money/auth/delete/listing`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId }),
      credentials: "include",
    })
  ).json();

  return response;
};
