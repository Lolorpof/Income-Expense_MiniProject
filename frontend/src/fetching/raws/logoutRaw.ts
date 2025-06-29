import type { TApiResponse } from "@/types/api.type";

export const logoutRaw = async () => {
  const response: TApiResponse<any> = await (
    await fetch("http://localhost:6900/api/auth/user/logout", {
      method: "POST",
      credentials: "include",
    })
  ).json();

  return response;
};
