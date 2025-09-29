import { createLazyFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/calendarEntry/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
