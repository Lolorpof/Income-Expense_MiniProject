import { deleteListing } from "@/fetching/raws/deleteListingRaw";
import type { TListingEntriesComb } from "@/types/money.type";
import { useMutation, type QueryClient } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";

export default function Listing({
  className,
  entryDate,
  entryList,
  queryClient,
}: {
  className: string;
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
      console.log(data);
      if (data.ok && data.data.entryEmpty) {
        console.log(`is entry empty? ${data.data.entryEmpty}`);
        await queryClient.invalidateQueries({ queryKey: ["allEntries"] });
      }
    },
  });
  return (
    <>
      <div
        className={`mb-3 mx-4 rounded-md ${
          entryList.isSpent
            ? "bg-gradient-to-bl from-violet-700 to-purple-800"
            : "bg-gradient-to-tr from-violet-700 to-purple-800"
        }`}
      >
        <div className="w-full h-fit mb-3">
          <TrashIcon
            className={`relative top-2 left-2 p-2 rounded-4xl bg-red-600 text-white shadow-black/40 shadow-lg ${
              isPending ? "cursor-progress" : "hover:cursor-pointer"
            }`}
            size={40}
            onClick={() => mutate()}
            aria-disabled={isPending}
          />
        </div>
        <div className={`${className} grid grid-cols-3 p-2  `}>
          <span className="rounded-md text-center px-2 py-1 mx-2 text-lg font-bold bg-gray-950 text-amber-600">
            Action (รายการ)
          </span>
          <span className="rounded-md px-2 py-1 mx-2 text-center text-lg font-bold bg-gray-950 text-amber-600">
            Time (เวลาทำรายการ)
          </span>
          <span
            className={`rounded-md px-2 py-1 mx-2 text-center text-lg font-bold bg-gray-950 text-amber-600 ${
              entryList.isSpent
                ? "border-l-16 border-red-500/90"
                : "border-l-16 border-emerald-500/90"
            }`}
          >
            Amount (จำนวนเงิน)
          </span>

          <span
            className={`p-2 mt-2 mx-2 rounded-lg break-words font-semibold text-lg bg-gray-900 text-amber-500`}
          >
            {entryList.action}
          </span>

          <span
            className={`p-2 mt-2 mx-2 break-words rounded-lg font-bold text-2xl bg-gray-900 text-amber-500`}
          >
            {entryList.time}
          </span>

          <span
            className={`p-2 mt-2 mx-2 rounded-lg break-words font-bold text-2xl bg-gray-900 text-amber-500`}
          >
            {entryList.isSpent
              ? -1 * entryList.spentOrEarned
              : entryList.spentOrEarned}
          </span>
        </div>
      </div>
    </>
  );
}
