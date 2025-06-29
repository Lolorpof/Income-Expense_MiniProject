import { Link, useRouteContext } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../fetching/queries/getCurrentUser";
import LinkButton from "./LinkButton";
import type { TRouterContext } from "@/types/route.type";
import { Spinner } from "../ui/spinner";
import Logout from "../auth/Logout";

export default function Navbar() {
  const { data: currentUser, isLoading } = useQuery(getCurrentUser);
  const { queryClient }: TRouterContext = useRouteContext({ from: "__root__" });

  return (
    <>
      <div className="flex flex-row flex-wrap p-2 m-2 gap-4 justify-end">
        {isLoading ? (
          <>
            <Spinner size={28} />
          </>
        ) : (
          <>
            <LinkButton>
              <Link to="/">Home</Link>
            </LinkButton>

            {!currentUser?.ok && (
              <>
                <LinkButton>
                  <Link to="/auth" search={{ type: "login" }}>
                    Login
                  </Link>
                </LinkButton>
                <LinkButton>
                  <Link to="/auth" search={{ type: "signup" }}>
                    Signup
                  </Link>
                </LinkButton>
              </>
            )}
            {currentUser && currentUser.ok && (
              <>
                <LinkButton>
                  <Link to="/profile"> Profile </Link>
                </LinkButton>
                <Logout queryClient={queryClient} />
              </>
            )}
          </>
        )}
      </div>
      <hr className="border-2 border-b-cyan-700 my-1" />
    </>
  );
}
