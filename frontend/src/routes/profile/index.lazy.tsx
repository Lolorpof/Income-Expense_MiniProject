import { Spinner } from "@/components/ui/spinner";
import { getCurrentUser } from "@/fetching/queries/getCurrentUser";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: currentUser, isLoading, error } = useQuery(getCurrentUser);
  const navigate = useNavigate();

  if (currentUser && !currentUser.ok) {
    navigate({ to: "/auth", search: { type: "login" } });
  }
  return isLoading || !currentUser ? (
    <>
      <div className="flex w-full justify-center">
        <Spinner size={36} className="mt-4" />
      </div>
    </>
  ) : error ? (
    <>Error occured when fetching</>
  ) : (
    currentUser.ok && (
      <>
        <div className="flex w-dvw justify-center my-4">
          <div className="flex flex-col shadow p-4 items-center">
            <text className="text-2xl text-amber-500 font-bold">Username</text>
            <text className="text-amber-300 text-3xl">
              {currentUser.data.username}
            </text>
          </div>
        </div>
      </>
    )
  );
}
