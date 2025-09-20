import { QueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import type { TApiResponse } from "../../types/api.type";
import type { TFormUser } from "../../types/user.type";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";

export default function UserForm({
  type,
  mutationFunction,
  queryClient,
}: {
  type: string;
  mutationFunction: (form: TFormUser) => Promise<TApiResponse<any>>;
  queryClient: QueryClient;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const mutationKey = type === "login" ? "login" : "signup";
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationKey: [mutationKey],
    mutationFn: mutationFunction,
    onSuccess: (data) => {
      if (!data.ok) {
        toast.error(`Failed to ${type === "login" ? "Login" : "Signup"}`, {
          description: data.message,
          position: "top-center",
          closeButton: true,
          richColors: true,
        });
      } else {
        toast.success(`Successfully ${type === "login" ? "Login" : "Signup"}`, {
          description: data.message,
          position: "top-center",
          closeButton: true,
          richColors: true,
        });
        queryClient.invalidateQueries({ queryKey: ["current", "user"] });
        if (type === "login") {
          navigate({ to: "/" });
        } else {
          navigate({ to: "/auth", search: { type: "login" } });
        }
      }
    },
  });

  return (
    <>
      <div className="text-4xl my-4 text-amber-500 font-bold">
        {type === "login" ? "Login" : "Signup"}
      </div>
      <div className="my-2">
        <label
          className="font-semibold text-amber-300 text-2xl"
          title="username"
        >
          Username
        </label>
        <br />
        <Input
          className="w-full h-[4dvh] text-white text-xl placeholder-amber-100/80"
          name="username"
          value={username}
          type="text"
          placeholder="Insert your username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="my-2">
        <label
          className="font-semibold text-amber-300 text-2xl"
          title="password"
        >
          Password
        </label>
        <br />
        <Input
          className="w-full h-[4dvh] text-white text-xl placeholder-amber-100/80"
          name="password"
          value={password}
          type={isChecked ? "text" : "password"}
          placeholder="Insert your password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex justify-end">
        <div className="flex mx-2 py-1">
          <span className="text-white text-lg">Show Password</span>
        </div>
        <Input
          className="shadow-none w-fit"
          type="checkbox"
          onChange={(e) => setIsChecked(e.target.checked)}
          checked={isChecked}
          placeholder="Show password"
        />
      </div>

      <div className="my-2 flex items-end justify-center">
        <Button
          className="text-2xl p-2.5 my-2 h-fit min-w-full bg-purple-500 hover:bg-purple-800 hover:cursor-pointer"
          variant={"default"}
          title="login"
          type="submit"
          onClick={() => mutate({ username, password })}
          disabled={username === "" || password === "" || isPending}
        >
          {isPending && (
            <>
              <Spinner size={28}></Spinner>
            </>
          )}
          {type === "login" ? "Login" : "Register"}
        </Button>
      </div>
    </>
  );
}
