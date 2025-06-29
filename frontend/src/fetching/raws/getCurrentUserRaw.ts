import type { TApiResponse } from "../../types/api.type";
import type { TUser } from "../../types/user.type";

export const getCurrentUserRaw = async () => {
  const response: TApiResponse<TUser> = await (
    await fetch("http://localhost:6900/api/user/current", {
      method: "GET",
      credentials: "include",
    })
  ).json();
  return response;
};
