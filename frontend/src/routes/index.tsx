import { createFileRoute, useNavigate } from "@tanstack/react-router";
import "../utils/queryClient";
import { getCurrentUser } from "../fetching/queries/getCurrentUser";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/")({
  component: () => {
    const { data: currentUser, isLoading, error } = useQuery(getCurrentUser);
    const navigate = useNavigate();

    if (currentUser && !currentUser.ok) {
      navigate({ to: "/auth", search: { type: "login" } });
    }

    return isLoading || !currentUser || !currentUser.ok ? (
      <>
        <Spinner size={32} />
      </>
    ) : error ? (
      <>Error when fetching: {error}</>
    ) : (
      currentUser.ok && <>{currentUser.message}</>
    );
  },
});
