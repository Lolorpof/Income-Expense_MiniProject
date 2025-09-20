import { createFileRoute, useNavigate } from "@tanstack/react-router";
import "../utils/queryClient";
import { getCurrentUser } from "../fetching/queries/getCurrentUser";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import Calendar from "@/components/incexp/Calendar";

export const Route = createFileRoute("/")({
  component: () => {
    const { data: currentUser, isLoading, error } = useQuery(getCurrentUser);
    const navigate = useNavigate();
    const { date } = Route.useSearch();

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
            prevDateState={date && date !== "" ? date : undefined}
            currentUser={currentUser.data}
          />
        </>
      )
    );
  },
});
