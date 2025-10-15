import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { getCurrentUser } from "../../fetching/queries/getCurrentUser";
import type { TRouterContext } from "../../types/route.type";
import UserForm from "../../components/auth/UserForm";
import { loginRaw } from "../../fetching/raws/loginRaw";
import { signUpRaw } from "../../fetching/raws/signupRaw";
import { Spinner } from "@/components/ui/spinner";

export const Route = createLazyFileRoute("/auth/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: currentUser, isLoading } = useQuery(getCurrentUser);
  const { type } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { queryClient }: TRouterContext = Route.useRouteContext();

  if (currentUser && currentUser.ok) {
    navigate({ to: "/" });
  }

  return isLoading ? (
    <>
      <div className="flex w-full justify-center">
        <Spinner size={36} className="mt-4" />
      </div>
    </>
  ) : (
    <>
      <div className="flex flex-col items-center py-2 my-10">
        <div className="rounded-lg flex flex-col bg-gray-900 p-8 shadow-amber-300 shadow-xl w-[25dvw]">
          {(!type || type === "login") && (
            <UserForm
              key={type || "login"}
              type={type || "login"}
              mutationFunction={loginRaw}
              queryClient={queryClient}
            />
          )}
          {type === "signup" && (
            <UserForm
              key={type}
              type={type}
              mutationFunction={signUpRaw}
              queryClient={queryClient}
            />
          )}
        </div>
      </div>
    </>
  );
}
