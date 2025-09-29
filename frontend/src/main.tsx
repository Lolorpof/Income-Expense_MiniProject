import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { routeTree } from "./routeTree.gen.ts";
import "./utils/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./utils/queryClient";
import type { TRouterContext } from "./types/route.type.ts";
import { Toaster } from "@/components/ui/sonner.tsx";

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => (
    <>
      <div className="justify-center justify-items-center">
        <p className="p-2 text-3xl font-extrabold">404 Page Not Found...</p>
      </div>
    </>
  ),
  context: { queryClient } as TRouterContext,
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <RouterProvider router={router} context={{ queryClient }} />
      <TanStackRouterDevtools router={router} />
      <ReactQueryDevtools client={queryClient} />
      <Toaster
        toastOptions={{
          classNames: {
            success: "bg-emerald-700 text-gray-200 font-semibold",
            error: "bg-rose-700 text-gray-100 font-semibold",
            warning: "bg-yellow-300 text-black font-semibold",
          },
          closeButton: true,
        }}
      />
    </StrictMode>
  </QueryClientProvider>
);
