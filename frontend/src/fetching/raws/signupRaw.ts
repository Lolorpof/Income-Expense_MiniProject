import type { TApiResponse } from "@/types/api.type";
import type { TFormUser } from "../../types/user.type";

export const signUpRaw = async (signupForm: TFormUser) => {
  const response: TApiResponse<any> = await (
    await fetch("http://localhost:6900/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signupForm),
      credentials: "include",
    })
  ).json();

  return response;
};
