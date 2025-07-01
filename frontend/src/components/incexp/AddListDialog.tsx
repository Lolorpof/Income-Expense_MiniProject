import { LucidePlus } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import InputField from "./InputField";
import dayjs from "dayjs";

Dialog;

export default function AddListDialog({
  displayDate,
}: {
  displayDate: string;
}) {
  const [action, setAction] = useState("");
  const [time, setTime] = useState("");
  const [actionType, setActionType] = useState("None");

  // debug InputField component
  //   useEffect(() => {
  //     console.log(action);
  //   }, [action]);

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
            {/* <div className="flex items-center">
              <label className="font-bold min-w-[30%]" title="time">
                Time:{" "}
              </label>
              <Input
                list="actionType"
                value={actionType}
                defaultValue="None"
                onChange={(e) => setActionType(e.target.value)}
              />
              <datalist id="actionType">
                <option value="None" />
                <option value="+" />
                <option value="-" />
              </datalist>
              <Input
                className="ml-2 min-w-fit"
                placeholder="Time of the day the action is done"
              />
            </div> */}
          </div>
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
