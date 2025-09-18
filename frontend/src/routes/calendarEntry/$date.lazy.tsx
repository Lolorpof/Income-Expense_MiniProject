import { Spinner } from "@/components/ui/spinner";
import { getEntryByDate } from "@/fetching/queries/getEntryByDate";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import AddListDialog from "@/components/incexp/AddListDialog";
import Listing from "@/components/incexp/Listing";

export const Route = createLazyFileRoute("/calendarEntry/$date")({
  component: RouteComponent,
});

function RouteComponent() {
  const { date }: { date: string } = Route.useParams();
  const displayDate = dayjs(date).format("MMMM, DD YYYY");

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
      <div className="w-full h-[90vh] flex bg-gray-200 justify-center">
        <div className="relative w-[60%] h-fit my-10 rounded-3xl border-8 border-blue-500 bg-blue-200 justify-center">
          <AddListDialog
            key={date}
            date={date}
            displayDate={displayDate}
            entry={entry}
            entryRefetch={entryRefetch}
          />
          <AnimatePresence mode="wait">
            <motion.h2 className="text-center m-10 text-4xl font-bold text-cyan-900">
              {displayDate}
              <div>
                {entry.ok &&
                  entry.data.map((en) => (
                    <Listing key={en.listingId} entryList={en} />
                  ))}
              </div>
            </motion.h2>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
