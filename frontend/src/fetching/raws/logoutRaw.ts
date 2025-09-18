import type { TApiResponse } from "@/types/api.type";
import { backendURL } from "@/utils/fetchingEndpoint";

export const logoutRaw = async () => {
  const response: TApiResponse<any> = await (
    await fetch(`${backendURL}api/auth/user/logout`, {
      method: "POST",
      credentials: "include",
    })
  ).json();

  return response;
};
