import type { TApiResponse } from "../../types/api.type";
import type { TFormUser } from "../../types/user.type";

export const loginRaw = async (loginForm: TFormUser) => {
  const response: TApiResponse<any> = await (
    await fetch("http://localhost:6900/api/auth/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginForm),
      credentials: "include",
    })
  ).json();

  return response;
};
