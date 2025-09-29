import type { TApiResponse } from "@/types/api.type";
import type { TFormUser } from "../../types/user.type";
import { backendURL } from "@/utils/fetchingEndpoint";

export const signUpRaw = async (signupForm: TFormUser) => {
  const response: TApiResponse<any> = await (
    await fetch(`${backendURL}api/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signupForm),
      credentials: "include",
    })
  ).json();

  return response;
};
