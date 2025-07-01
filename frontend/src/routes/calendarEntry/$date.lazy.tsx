import { Spinner } from "@/components/ui/spinner";
import { getEntryByDate } from "@/fetching/queries/getEntryByDate";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { LucidePlus } from "lucide-react";
import { createEntryRaw } from "@/fetching/raws/createEntryRaw";
import type { Dialog, DialogClose } from "@/components/ui/dialog";
import AddListDialog from "@/components/incexp/AddListDialog";

export const Route = createLazyFileRoute("/calendarEntry/$date")({
  component: RouteComponent,
});

function RouteComponent() {
  const { date }: { date: string } = Route.useParams();
  const formattedDate = dayjs(date).toDate();
  const displayDate = dayjs(date).format("MMMM, DD YYYY");
  const { queryClient }: { queryClient: QueryClient } = Route.useRouteContext();

  const { data: entry, isLoading } = useQuery(getEntryByDate(date));
  const {
    data: createdEntry,
    mutate,
    isPending,
  } = useMutation({
    mutationKey: ["create", date],
    mutationFn: () => createEntryRaw(formattedDate),
  });

  function createList() {
    // no entry existed yet
    if (entry && !entry.ok) {
      mutate();
    }
  }

  return isLoading || !entry ? (
    <>
      <div className="flex w-full justify-center">
        <Spinner size={36} className="mt-4" />
      </div>
    </>
  ) : (
    <>
      <div className="w-full h-[90vh] flex bg-gray-200 justify-center">
        <div className="relative w-[60%] h-fit my-10 rounded-3xl border-8 border-blue-500 bg-blue-200 justify-center">
          <AddListDialog displayDate={displayDate} />
          <AnimatePresence mode="wait">
            <motion.h2 className="text-center m-10 text-4xl font-bold text-cyan-900">
              {displayDate}
            </motion.h2>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
