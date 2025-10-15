import type { TApiResponse } from "@/types/api.type";
import type {
  TCreatedEntryForDate,
  TInsertListingDayForm,
} from "@/types/money.type";
import { backendURL } from "@/utils/fetchingEndpoint";

export const createListing = async (
  insertListingForm: TInsertListingDayForm
) => {
  const response: TApiResponse<TCreatedEntryForDate> = await (
    await fetch(`${backendURL}api/money/auth/create/listing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(insertListingForm),
      credentials: "include",
    })
  ).json();

  return response;
};
