import { Link, useMatchRoute, useRouteContext } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../fetching/queries/getCurrentUser";
import LinkButton from "./LinkButton";
import type { TRouterContext } from "@/types/route.type";
import { Spinner } from "../ui/spinner";
import Logout from "../auth/Logout";

export default function Navbar() {
  const { data: currentUser, isLoading } = useQuery(getCurrentUser);
  const { queryClient }: TRouterContext = useRouteContext({ from: "__root__" });

  const matchRoute = useMatchRoute();
  const isHome = matchRoute({ to: "/" });
  const isLogin = matchRoute({ to: "/auth", search: { type: "login" } });
  const isSignup = matchRoute({ to: "/auth", search: { type: "signup" } });
  const isProfile = matchRoute({ to: "/profile" });

  return (
    <>
      <div className="flex flex-row flex-wrap p-2 m-2 gap-4 justify-end">
        {isLoading ? (
          <>
            <Spinner size={28} />
          </>
        ) : (
          <>
            <LinkButton isActive={!!isHome}>
              <Link to="/" disabled={!!isHome}>
                Home
              </Link>
            </LinkButton>

            {!currentUser?.ok && (
              <>
                <LinkButton isActive={!!isLogin}>
                  <Link
                    to="/auth"
                    search={{ type: "login" }}
                    disabled={!!isLogin}
                  >
                    Login
                  </Link>
                </LinkButton>
                <LinkButton isActive={!!isSignup}>
                  <Link
                    to="/auth"
                    search={{ type: "signup" }}
                    disabled={!!isSignup}
                  >
                    Signup
                  </Link>
                </LinkButton>
              </>
            )}
            {currentUser && currentUser.ok && (
              <>
                <LinkButton isActive={!!isProfile}>
                  <Link to="/profile" disabled={!!isProfile}>
                    {" "}
                    Profile{" "}
                  </Link>
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
