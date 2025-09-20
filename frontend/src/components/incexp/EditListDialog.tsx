import { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from "../ui/dialog";
import InputField from "./InputField";
import { Button } from "../ui/button";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";
import { editListing } from "@/fetching/raws/editListingRaw";
import { EditIcon } from "lucide-react";
import { toast } from "sonner";

export default function EditListDialog({
  date,
  listingId,
  displayDate,
  curAction,
  curTime,
  curAmount,
  isSpent,
  queryClient,
}: {
  date: string;
  listingId: string;
  displayDate: string;
  curAction: string;
  curTime: string;
  curAmount: number;
  isSpent: boolean;
  queryClient: QueryClient;
}) {
  const [action, setAction] = useState(curAction);
  const [time, setTime] = useState(curTime);
  const [actionSymbol, setActionSymbol] = useState(
    isSpent ? "subtract" : "add"
  );
  const [amount, setAmount] = useState(curAmount); // positive only

  const { mutate, isPending } = useMutation({
    mutationKey: ["edit", listingId],
    mutationFn: () =>
      editListing(
        listingId,
        action,
        time,
        actionSymbol === "add" ? amount : -1 * amount
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["entry", date] });
      toast.success("Successfully edit listing!", {
        richColors: true,
        position: "top-center",
        closeButton: true,
      });
    },
  });

  function clickEditListing() {
    // data isn't changed at all, do nothing
    const tempIsSpent = actionSymbol === "add" ? false : true;
    if (
      curAction === action &&
      curTime === time &&
      curAmount === amount &&
      isSpent === tempIsSpent
    ) {
      return;
    }

    mutate();
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <EditIcon
            className={`relative top-2 left-5 p-1.5 rounded-[100%] bg-amber-500 hover:bg-amber-700 hover:scale-120 text-white ${
              isPending ? "cursor-progress" : "hover:cursor-pointer"
            }`}
            size={40}
          />
        </DialogTrigger>
        <DialogContent className="bg-black/70 border-amber-500">
          <DialogHeader>
            <DialogTitle className="text-amber-600">
              Edit an Income-Expense List
            </DialogTitle>
            <DialogDescription className="text-amber-500">
              Edit an existing Income-Expense List for
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
              onClick={clickEditListing}
              disabled={
                action === "" ||
                time === "" ||
                amount == 0 ||
                String(amount) == "" ||
                isPending
              }
            >
              {isPending && <Spinner size={28} />}
              Edit
            </Button>
          </div>
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
