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
import { useState } from "react";
import InputField from "./InputField";
import { Button } from "../ui/button";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { createEntryRaw } from "@/fetching/raws/createEntryRaw";
import type { TListingEntriesComb } from "@/types/money.type";
import type { TApiResponse } from "@/types/api.type";
import { createListing } from "@/fetching/raws/createListingRaw";
import { toast } from "sonner";
import { ListingSchema } from "@/utils/zod/schema";
import { fromError } from "zod-validation-error";
import { Spinner } from "../ui/spinner";

Dialog;

export default function AddListDialog({
  date,
  displayDate,
  entry,
  queryClient,
}: {
  date: string;
  displayDate: string;
  entry: TApiResponse<TListingEntriesComb>;
  queryClient: QueryClient;
}) {
  const [action, setAction] = useState("");
  const [time, setTime] = useState("");
  const [actionSymbol, setActionSymbol] = useState("add");
  const [amount, setAmount] = useState(0);

  const [dialogOpen, setDialogOpen] = useState(false);

  const { mutate: dayEntryMutate, isPending: dayEntryPending } = useMutation({
    mutationKey: ["create", date],
    mutationFn: () => {
      return createEntryRaw(date);
    },
    onSuccess: async (data) => {
      if (data.ok) {
        await queryClient.invalidateQueries({ queryKey: ["entry", date] });
        await queryClient.invalidateQueries({ queryKey: ["allEntries"] });
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
        console.log(data);
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
    mutationFn: createListing,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["entry", date] });
      await queryClient.invalidateQueries({ queryKey: ["allEntries"] });

      setDialogOpen(false);
      setAction("");
      setTime("");
      setActionSymbol("add");
      setAmount(0);

      toast.success("Successfully create listing!", {
        richColors: true,
        closeButton: true,
        position: "top-center",
      });
    },
  });
  // debug InputField component
  // useEffect(() => {
  //   console.log(amount);
  // }, [amount]);

  const clickAddListing = () => {
    // entry doesn't existed yet, create it
    console.log(entry);
    if (!entry.ok) {
      dayEntryMutate();
    } else {
      const formattedResult = ListingSchema.safeParse({
        action: action,
        time: time,
        spentOrEarned: actionSymbol === "add" ? 1 * amount : -1 * amount,
        moneyDailyId: entry.data.entry.id,
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
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <div hidden={dialogOpen}>
            <LucidePlus className="fixed bottom-4 left-4 rounded-[100%] size-[6dvh] aspect-square bg-purple-600 hover:cursor-pointer hover:bg-purple-600/70 hover:scale-125 text-white duration-200 z-50" />
          </div>
        </DialogTrigger>
        <DialogContent className="bg-black/70 border-amber-500">
          <DialogHeader>
            <DialogTitle className="text-amber-600">
              Add an Income-Expense List
            </DialogTitle>
            <DialogDescription className="text-amber-500">
              Create a new Income-Expense List for
              <span className="rounded-md font-bold bg-white/25 ml-1 p-1">
                {" "}
                {displayDate}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 flex flex-wrap w-full gap-2 text-amber-500">
            <InputField<string>
              key="action"
              type="text"
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
              inputClassName="placeholder-amber-100/60"
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
              inputClassName="placeholder-amber-100/60"
            />
          </div>
          <div className="w-full h-full justify-end">
            <Button
              className=" bg-purple-500 hover:bg-purple-800 text-xl p-4 hover:backdrop-brightness-100 hover:cursor-pointer duration-200"
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
