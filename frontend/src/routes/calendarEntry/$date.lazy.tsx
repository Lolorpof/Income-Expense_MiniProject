import { Spinner } from "@/components/ui/spinner";
import { getEntryByDate } from "@/fetching/queries/getEntryByDate";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import AddListDialog from "@/components/incexp/AddListDialog";
import Listing from "@/components/incexp/Listing";
import type { TRouterContext } from "@/types/route.type";
import { ArrowLeftIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const Route = createLazyFileRoute("/calendarEntry/$date")({
  component: RouteComponent,
});

function RouteComponent() {
  const { date }: { date: string } = Route.useParams();
  const displayDate = dayjs(date).format("MMMM, DD YYYY");
  const { queryClient }: TRouterContext = Route.useRouteContext();
  const navigate = Route.useNavigate();

  const { data: entry, isLoading } = useQuery(getEntryByDate(date));

  const [oldSpent, setOldSpent] = useState(
    entry && entry.ok ? entry.data.entry.totalSpent : 0
  );
  const [oldEarned, setOldEarned] = useState(
    entry && entry.ok ? entry.data.entry.totalEarned : 0
  );
  const [oldNet, setOldNet] = useState(
    entry && entry.ok ? entry.data.entry.netTotal : 0
  );

  // change old value to new after transition is done
  useEffect(() => {
    setTimeout(() => {}, 300);
    setOldSpent(entry && entry.ok ? entry.data.entry.totalSpent : 0);
    setOldEarned(entry && entry.ok ? entry.data.entry.totalEarned : 0);
    setOldNet(entry && entry.ok ? entry.data.entry.netTotal : 0);
  }, [entry]);

  return isLoading || !entry ? (
    <>
      <div className="flex w-full justify-center">
        <Spinner size={36} className="mt-4" />
      </div>
    </>
  ) : (
    <>
      <div className="w-full h-[90vh] flex justify-center">
        <AddListDialog
          key={date}
          date={date}
          displayDate={displayDate}
          entry={entry}
          queryClient={queryClient}
        />
        <div className="relative w-fit min-w-[60%] max-w-[90%] h-fit my-10 rounded-lg border-6 border-amber-600 bg-white/5 justify-center">
          <ArrowLeftIcon
            size={50}
            className={`absolute top-3.5 left-3.5 rounded-[100%] bg-purple-600 hover:bg-purple-800 hover:cursor-pointer hover:scale-125 text-amber-500 duration-200`}
            onClick={() => navigate({ to: "/", search: { date: date } })}
          />

          <h2 className="text-center">
            <div className="m-10 mb-5 text-4xl font-bold text-white">
              {displayDate}
            </div>
            <div className="min-w-fit">
              <div className="flex flex-wrap min-w-max p-1 m-0 mb-4 h-fit text-2xl font-bold">
                <span className="flex-1 py-2 mx-2 bg-red-500/40 text-amber-500">
                  Total Spent:{" "}
                  <motion.span
                    className="inline-block"
                    key={entry.ok ? entry.data.entry.totalSpent : 0}
                    initial={{
                      opacity: 0,
                      y: entry.ok
                        ? entry.data.entry.totalSpent === oldSpent
                          ? 0
                          : entry.data.entry.totalSpent > oldSpent
                          ? 20
                          : -20
                        : 0,
                    }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: ["easeOut"] }}
                  >
                    {entry.ok ? entry.data.entry.totalSpent : 0}
                  </motion.span>
                </span>
                <span className="flex-1 py-2 mx-2 bg-emerald-500/40 text-amber-500">
                  Total Earned:{" "}
                  <motion.span
                    className="inline-block"
                    key={entry.ok ? entry.data.entry.totalEarned : 0}
                    initial={{
                      opacity: 0,
                      y: entry.ok
                        ? entry.data.entry.totalEarned === oldEarned
                          ? 0
                          : entry.data.entry.totalEarned > oldEarned
                          ? 20
                          : -20
                        : 0,
                    }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: ["easeOut"] }}
                  >
                    {entry.ok ? entry.data.entry.totalEarned : 0}
                  </motion.span>
                </span>
                <span className="flex-1 py-2 mx-2 bg-white/30 text-amber-500">
                  Net Total:{" "}
                  <motion.span
                    className="inline-block"
                    key={entry.ok ? entry.data.entry.netTotal : 0}
                    initial={{
                      opacity: 0,
                      y: entry.ok
                        ? entry.data.entry.netTotal === oldNet
                          ? 0
                          : entry.data.entry.netTotal > oldNet
                          ? 20
                          : -20
                        : 0,
                    }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: ["easeOut"] }}
                  >
                    {entry.ok ? entry.data.entry.netTotal : 0}
                  </motion.span>
                </span>
              </div>
              <div className="min-w-full">
                <AnimatePresence mode="sync">
                  {entry.ok &&
                    entry.data.listings.map((listings) => (
                      <Listing
                        key={listings.id}
                        displayDate={displayDate}
                        entryDate={entry.data.entry.date}
                        entryList={listings}
                        queryClient={queryClient}
                        className=""
                      />
                    ))}
                </AnimatePresence>
              </div>
            </div>
          </h2>
        </div>
      </div>
    </>
  );
}
