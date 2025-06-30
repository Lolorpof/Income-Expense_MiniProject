import { Spinner } from "@/components/ui/spinner";
import { getEntryByDate } from "@/fetching/queries/getEntryByDate";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { LucidePlus } from "lucide-react";

export const Route = createLazyFileRoute("/calendarEntry/$date")({
  component: RouteComponent,
});

function RouteComponent() {
  const { date }: { date: string } = Route.useParams();
  const { data: entry, isLoading } = useQuery(getEntryByDate(date));
  const displayDate = dayjs(date).format("MMMM, DD YYYY");
  const { queryClient }: { queryClient: QueryClient } = Route.useRouteContext();

  return isLoading || !entry ? (
    <>
      <div className="flex w-full justify-center">
        <Spinner size={36} className="mt-4" />
      </div>
    </>
  ) : (
    <>
      <div className="w-full h-[90vh] flex bg-gray-200 justify-center">
        <div className="w-[60%] h-fit my-10 rounded-3xl border-8 border-blue-500 bg-blue-200 justify-center">
          <LucidePlus className="rounded-[100%] size-[4dvh] aspect-square absolute mt-[1%] ml-[1%] bg-emerald-800 hover:cursor-pointer hover:bg-emerald-600 hover:scale-115 text-white duration-200" />
          <motion.h2 className="text-center m-10 text-4xl font-bold text-cyan-900">
            {displayDate}
          </motion.h2>
        </div>
      </div>
    </>
  );
}
