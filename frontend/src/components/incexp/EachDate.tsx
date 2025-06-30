import { createEntryRaw } from "@/fetching/raws/createEntryRaw";
import type { TIncExpDateId } from "@/types/money.type";
import { useMutation, type QueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Spinner } from "../ui/spinner";

export default function EachDate({
  day,
  currentDate,
  currentMonth,
  currentYear,
  entry,
  queryClient,
}: {
  day: number;
  currentDate: Date;
  currentMonth: number;
  currentYear: number;
  entry?: TIncExpDateId;
  queryClient: QueryClient;
}) {
  const navigate = useNavigate();

  return (
    <>
      <div
        key={day}
        className={
          "rounded-md aspect-square flex flex-col items-center bg-gray-300/60 hover:backdrop-brightness-80 hover:cursor-pointer duration-200 " +
          (entry ? "border-b-10 border-emerald-500 " : "") +
          (day + 1 === currentDate.getDate() &&
            currentMonth === currentDate.getMonth() &&
            currentYear === currentDate.getFullYear() &&
            "border-4 border-yellow-300 shadow-xl")
        }
        onClick={() =>
          navigate({
            to: "/calendarEntry/$date",
            params: {
              date: entry
                ? entry.date
                : `${currentYear}-${
                    currentMonth + 1 >= 10
                      ? currentMonth + 1
                      : `0${currentMonth + 1}`
                  }-${day + 1 >= 10 ? day + 1 : `0${day + 1}`}`,
            },
          })
        }
      >
        <span
          className={
            "mt-2 w-[30%] h-[30%] text-center" +
            (day + 1 === currentDate.getDate() &&
            currentMonth === currentDate.getMonth() &&
            currentYear === currentDate.getFullYear()
              ? " px-1 py-0.5 rounded-4xl bg-amber-300 text-indigo-600 font-bold"
              : " font-semibold")
          }
        >
          {day + 1}
        </span>
      </div>
    </>
  );
}
