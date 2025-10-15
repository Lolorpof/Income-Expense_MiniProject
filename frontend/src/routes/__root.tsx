import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import Navbar from "../components/Navbar/Navbar";
import { getCurrentUser } from "../fetching/queries/getCurrentUser";
import type { TRouterContext } from "../types/route.type";

export const Route = createRootRouteWithContext<TRouterContext>()({
  component: () => (
    <>
      <Navbar />
      <Outlet />
    </>
  ),
  loader: async ({ context }) =>
    context.queryClient.ensureQueryData(getCurrentUser),
});
