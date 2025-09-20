import { Spinner } from "@/components/ui/spinner";
import { getEntryByDate } from "@/fetching/queries/getEntryByDate";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import AddListDialog from "@/components/incexp/AddListDialog";
import Listing from "@/components/incexp/Listing";
import type { TRouterContext } from "@/types/route.type";

export const Route = createLazyFileRoute("/calendarEntry/$date")({
  component: RouteComponent,
});

function RouteComponent() {
  const { date }: { date: string } = Route.useParams();
  const displayDate = dayjs(date).format("MMMM, DD YYYY");
  const { queryClient }: TRouterContext = Route.useRouteContext();

  const {
    data: entry,
    refetch: entryRefetch,
    isLoading,
  } = useQuery(getEntryByDate(date));

  return isLoading || !entry ? (
    <>
      <div className="flex w-full justify-center">
        <Spinner size={36} className="mt-4" />
      </div>
    </>
  ) : (
    <>
      <div className="w-full h-[90vh] flex justify-center">
        <div className="relative w-fit min-w-[60%] max-w-[90%] h-fit my-10 rounded-lg border-6 border-amber-600 bg-white/5 justify-center">
          <AddListDialog
            key={date}
            date={date}
            displayDate={displayDate}
            entry={entry}
            entryRefetch={entryRefetch}
            queryClient={queryClient}
          />
          <AnimatePresence mode="wait">
            <motion.h2 className="text-center">
              <div className="m-10 mb-5 text-4xl font-bold text-white">
                {displayDate}
              </div>
              <div className="min-w-fit">
                <div className="flex flex-wrap min-w-max p-1 m-0 mb-4 h-fit text-2xl font-bold">
                  <span className="flex-1 py-2 mx-2 bg-red-500/40 text-amber-500">
                    Total Spent:{" "}
                    <span>{entry.ok ? entry.data.entry.totalSpent : 0}</span>
                  </span>
                  <span className="flex-1 py-2 mx-2 bg-emerald-500/40 text-amber-500">
                    Total Earned:{" "}
                    <span>{entry.ok ? entry.data.entry.totalEarned : 0}</span>
                  </span>
                  <span className="flex-1 py-2 mx-2 bg-white/30 text-amber-500">
                    Net Total:{" "}
                    <span>{entry.ok ? entry.data.entry.netTotal : 0}</span>
                  </span>
                </div>
                {entry.ok && (
                  <>
                    <div className="min-w-full">
                      {entry.data.listings.map((listings) => (
                        <Listing
                          key={listings.id}
                          displayDate={displayDate}
                          entryDate={entry.data.entry.date}
                          entryList={listings}
                          queryClient={queryClient}
                          className=""
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.h2>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
