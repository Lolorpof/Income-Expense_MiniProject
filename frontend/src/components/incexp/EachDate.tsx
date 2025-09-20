import type { TIncExpDateId } from "@/types/money.type";
import { useNavigate } from "@tanstack/react-router";

export default function EachDate({
  day,
  currentDate,
  currentMonth,
  currentYear,
  entry,
}: {
  day: number;
  currentDate: Date;
  currentMonth: number;
  currentYear: number;
  entry?: TIncExpDateId;
}) {
  const navigate = useNavigate();

  return (
    <>
      <div
        key={day}
        className={
          "rounded-md aspect-square flex flex-col items-center bg-white/20 hover:bg-white/50 hover:cursor-pointer duration-200 " +
          (entry ? "border-b-10 border-purple-500 " : "") +
          (day + 1 === currentDate.getDate() &&
            currentMonth === currentDate.getMonth() &&
            currentYear === currentDate.getFullYear() &&
            "border-4 border-amber-500 shadow-white/40 shadow-lg")
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
            "absolute md:text-md lg:text-2xl text-amber-300 mt-2 max-w-[30%] max-h-[30%] text-center" +
            (day + 1 === currentDate.getDate() &&
            currentMonth === currentDate.getMonth() &&
            currentYear === currentDate.getFullYear()
              ? " px-1 py-0.5 rounded-4xl bg-amber-500 text-violet-800 shadow-purple-300/70 shadow-md font-bold"
              : " font-semibold")
          }
        >
          {day + 1}
        </span>
      </div>
    </>
  );
}
