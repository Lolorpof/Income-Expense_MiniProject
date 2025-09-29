import type { TRouterContext } from "@/types/route.type";
import { useMutation } from "@tanstack/react-query";
import { logoutRaw } from "@/fetching/raws/logoutRaw";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export default function Logout({ queryClient }: TRouterContext) {
  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logoutRaw,
    onSuccess: (data) => {
      if (!data.ok) {
        toast.error("Failed to Logout", {
          description: data.message,
          closeButton: true,
          richColors: true,
          position: "top-center",
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["current", "user"] });
        toast.success("Logout Successfully", {
          description: data.message,
          closeButton: true,
          richColors: true,
          position: "top-center",
        });
        navigate({ to: "/" });
      }
    },
  });

  return (
    <button
      className="rounded-2xl text-2xl font-bold text-amber-400 p-3 hover:bg-black/20 hover:scale-110 hover:-translate-y-1 hover:cursor-pointer duration-300"
      onClick={() => mutate()}
    >
      Logout
    </button>
  );
}
