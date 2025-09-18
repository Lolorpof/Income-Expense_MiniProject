import { LucidePlus } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { useEffect, useState } from "react";
import InputField from "./InputField";
import { Button } from "../ui/button";
import {
  useMutation,
  type QueryObserverResult,
  type RefetchOptions,
} from "@tanstack/react-query";
import { createEntryRaw } from "@/fetching/raws/createEntryRaw";
import type { TListingEntriesComb } from "@/types/money.type";
import type { TApiResponse } from "@/types/api.type";
import { createListChild } from "@/fetching/raws/createListChildRaw";
import { toast } from "sonner";
import { ListingSchema } from "@/utils/zod/schema";
import { fromError } from "zod-validation-error";
import { Spinner } from "../ui/spinner";

Dialog;

export default function AddListDialog({
  date,
  displayDate,
  entry,
  entryRefetch,
}: {
  date: string;
  displayDate: string;
  entry: TApiResponse<TListingEntriesComb>;
  entryRefetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<TApiResponse<TListingEntriesComb>, Error>>;
}) {
  const [action, setAction] = useState("");
  const [time, setTime] = useState("");
  const [actionSymbol, setActionSymbol] = useState("add");
  const [amount, setAmount] = useState(0);

  const { mutate: dayEntryMutate, isPending: dayEntryPending } = useMutation({
    mutationKey: ["create", date],
    mutationFn: () => {
      return createEntryRaw(date);
    },
    onSuccess: async (data) => {
      if (data.ok) {
        await entryRefetch();
        console.log(actionSymbol);
        const formattedResult = ListingSchema.safeParse({
          action: action,
          time: time,
          spentOrEarned: actionSymbol === "add" ? 1 * amount : -1 * amount,
          moneyDailyId: data.data.id,
        });
        // validate form with zod
        if (!formattedResult.success) {
          const err = fromError(formattedResult.error).toString();
          console.error(err);
          toast.error(err, {
            richColors: true,
            closeButton: true,
            position: "top-center",
          });
          return;
        }

        listingMutate(formattedResult.data);
      } else {
        toast.error("Can't create entry", {
          richColors: true,
          closeButton: true,
          position: "top-center",
        });
      }
    },
  });

  const { mutate: listingMutate, isPending: listingPending } = useMutation({
    mutationKey: ["create", action, time],
    mutationFn: createListChild,
    onSuccess: async () => {
      await entryRefetch();
    },
  });
  // debug InputField component
  useEffect(() => {
    console.log(amount);
  }, [amount]);

  const clickAddListing = () => {
    // entry doesn't existed yet, create it
    if (!entry.ok) {
      dayEntryMutate();
    } else {
      const formattedResult = ListingSchema.safeParse({
        action: action,
        time: time,
        spentOrEarned: actionSymbol === "add" ? 1 * amount : -1 * amount,
        moneyDailyId: entry.data[0].id,
      });
      // validate form with zod
      if (!formattedResult.success) {
        const err = fromError(formattedResult.error).toString();
        console.error(err);
        toast.error(err, {
          richColors: true,
          closeButton: true,
          position: "top-center",
        });
        return;
      }

      listingMutate(formattedResult.data);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <LucidePlus className="rounded-[100%] size-[4dvh] aspect-square absolute mt-[1%] ml-[1%] bg-emerald-800 hover:cursor-pointer hover:bg-emerald-600 hover:scale-115 text-white duration-200" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add an Income-Expense List</DialogTitle>
            <DialogDescription>
              Create a new Income-Expense List for
              <span className="rounded-md font-bold bg-gray-200 ml-1 p-1">
                {" "}
                {displayDate}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 flex flex-wrap gap-2">
            <InputField<string>
              key="action"
              title="Action"
              placeholder="Action of spending/earning money"
              value={action}
              changeStateFn={setAction}
            />
            <InputField<string>
              key="time"
              type="time"
              title="Time"
              placeholder="When the action happens"
              value={time}
              changeStateFn={setTime}
            />
            <InputField<number>
              key="spentEarned"
              title="Spent/Earned"
              placeholder="Amount of money"
              type="number"
              value={amount}
              changeStateFn={setAmount}
              symbolValue={actionSymbol}
              changeSymbolStateFn={setActionSymbol}
            />
          </div>
          <div className="w-full h-full justify-end">
            <Button
              className=" bg-emerald-500 hover:bg-emerald-800 text-xl p-4 hover:backdrop-brightness-100 hover:cursor-pointer duration-200"
              onClick={clickAddListing}
              disabled={
                action === "" ||
                time === "" ||
                amount == 0 ||
                String(amount) == "" ||
                dayEntryPending ||
                listingPending
              }
            >
              {dayEntryPending || (listingPending && <Spinner size={28} />)}
              Add
            </Button>
          </div>
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
