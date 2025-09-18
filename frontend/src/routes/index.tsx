import { createFileRoute, useNavigate } from "@tanstack/react-router";
import "../utils/queryClient";
import { getCurrentUser } from "../fetching/queries/getCurrentUser";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import Calendar from "@/components/incexp/Calendar";
import type { TRouterContext } from "@/types/route.type";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: () => {
    const { data: currentUser, isLoading, error } = useQuery(getCurrentUser);
    const navigate = useNavigate();
    const { queryClient }: TRouterContext = Route.useRouteContext();

    if (currentUser && !currentUser.ok) {
      navigate({ to: "/auth", search: { type: "login" } });
    }

    return isLoading || !currentUser || !currentUser.ok ? (
      <>
        <div className="flex w-full justify-center">
          <Spinner size={36} className="mt-4" />
        </div>
      </>
    ) : error ? (
      <>Error when fetching: {error}</>
    ) : (
      currentUser.ok && (
        <>
          <Calendar
            key={currentUser.data.id}
            currentUser={currentUser.data}
            queryClient={queryClient}
          />
        </>
      )
    );
  },
});
