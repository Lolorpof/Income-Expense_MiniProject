import { deleteListing } from "@/fetching/raws/deleteListingRaw";
import type { TListingEntriesComb } from "@/types/money.type";
import { useMutation, type QueryClient } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import EditListDialog from "./EditListDialog";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Listing({
  className,
  displayDate,
  entryDate,
  entryList,
  queryClient,
}: {
  className: string;
  displayDate: string;
  entryDate: string;
  entryList: TListingEntriesComb["listings"][0];
  queryClient: QueryClient;
}) {
  const { isPending, mutate } = useMutation({
    mutationKey: ["delete", entryList.id],
    mutationFn: () => deleteListing(entryList.id),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["entry", entryDate] });
      // entry for day is empty with no listing, refetch all entries
      if (data.ok && data.data.entryEmpty) {
        await queryClient.invalidateQueries({ queryKey: ["allEntries"] });
      }

      toast.success("Successfully delete listing!", {
        richColors: true,
        closeButton: true,
        position: "top-center",
      });
    },
  });

  return (
    <>
      <motion.div
        key={entryList.id}
        className={`mb-3 mx-4 rounded-md ${
          entryList.isSpent
            ? "bg-gradient-to-bl from-violet-700 to-purple-800"
            : "bg-gradient-to-tr from-violet-700 to-purple-800"
        }`}
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.25, ease: ["easeOut"] }}
      >
        <div className="flex w-full h-fit mb-3">
          <TrashIcon
            className={`relative top-2 left-2 p-2 rounded-[100%] bg-red-600 hover:bg-red-800 hover:scale-120 text-white shadow-black/40 shadow-lg duration-150 ${
              isPending ? "cursor-progress" : "hover:cursor-pointer"
            }`}
            size={32}
            onClick={() => mutate()}
            aria-disabled={isPending}
          />
          <EditListDialog
            date={entryDate}
            listingId={entryList.id}
            displayDate={displayDate}
            curAction={entryList.action}
            curTime={entryList.time}
            curAmount={entryList.spentOrEarned}
            isSpent={entryList.isSpent}
            queryClient={queryClient}
          ></EditListDialog>
        </div>
        <div className={`${className} grid grid-cols-3 p-2 gap-1`}>
          <span className="rounded-md text-center px-1 py-1 mx-1 md:mx-2 text-[10px] sm:text-xs md:text-lg font-bold bg-gray-950 text-amber-600">
            Action<span className="hidden md:inline"> (รายการ)</span>
          </span>
          <span className="rounded-md px-1 py-1 mx-1 md:mx-2 text-center text-[10px] sm:text-xs md:text-lg font-bold bg-gray-950 text-amber-600">
            Time<span className="hidden md:inline"> (เวลาทำรายการ)</span>
          </span>
          <span
            className={`rounded-md px-1 py-1 mx-1 md:mx-2 text-center text-[10px] sm:text-xs md:text-lg font-bold bg-gray-950 text-amber-600 ${
              entryList.isSpent
                ? "border-l-4 md:border-l-16 border-red-500/90"
                : "border-l-4 md:border-l-16 border-emerald-500/90"
            }`}
          >
            Amount<span className="hidden md:inline"> (จำนวนเงิน)</span>
          </span>

          <span
            className={`p-1 md:p-2 mt-1 md:mt-2 mx-1 md:mx-2 rounded-lg break-words font-semibold text-xs md:text-lg bg-gray-900 text-amber-500`}
          >
            {entryList.action}
          </span>

          <span
            className={`p-1 md:p-2 mt-1 md:mt-2 mx-1 md:mx-2 break-words rounded-lg font-bold text-xs md:text-2xl bg-gray-900 text-amber-500`}
          >
            {entryList.time}
          </span>

          <span
            className={`p-1 md:p-2 mt-1 md:mt-2 mx-1 md:mx-2 rounded-lg break-words font-bold text-xs md:text-2xl bg-gray-900 text-amber-500`}
          >
            {entryList.isSpent
              ? -1 * entryList.spentOrEarned
              : entryList.spentOrEarned}
          </span>
        </div>
      </motion.div>
    </>
  );
}
