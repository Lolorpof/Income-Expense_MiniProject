import { useEffect, useMemo, useState } from "react";
import { ChevronRightIcon, ChevronLeftIcon } from "lucide-react";
import "./calendar.css";
import { days, months } from "@/utils/calendar/calendar.util";
import type { TUser } from "@/types/user.type";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import EachDate from "./EachDate";
import { getAllEntriesDateIdByUserId } from "@/fetching/queries/getAllEntriesDateIdByUserId";
import { Spinner } from "../ui/spinner";
import dayjs from "dayjs";
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function Calendar({
  prevDateState,
  currentUser,
}: {
  prevDateState?: string;
  currentUser: TUser;
}) {
  const currentDate = new Date();
  const baseOldestYear = 10;
  const prevDate = prevDateState ? dayjs(prevDateState).toDate() : undefined;
  const [dir, setDir] = useState(0);
  const [calendarState, setCalendarState] = useState(() => ({
    month: prevDate ? prevDate.getMonth() : currentDate.getMonth(),
    year: prevDate ? prevDate.getFullYear() : currentDate.getFullYear(),
  }));

  const [currentMonthFirstDateDay, setCurrentMonthFirstDateDay] = useState(
    new Date(calendarState.year, calendarState.month, 1).getDay(),
  );
  const [daysInCurrentMonth, setDaysInCurrentMonth] = useState(
    new Date(calendarState.year, calendarState.month + 1, 0).getDate(),
  );

  const { data: entries, isLoading } = useQuery(
    getAllEntriesDateIdByUserId(currentUser.id),
  );

  const oldestYearAvail = useMemo(() => {
    const defaultOldestYear = currentDate.getFullYear() - baseOldestYear;
    if (entries?.ok) {
      if (entries.data.length <= 0) return defaultOldestYear;

      const oldestYear = entries.data.reduce((prev, cur) => {
        return new Date(prev.date).getFullYear() <
          new Date(cur.date).getFullYear()
          ? prev
          : cur;
      });

      return Math.min(
        defaultOldestYear,
        new Date(oldestYear.date).getFullYear(),
      );
    }

    return defaultOldestYear;
  }, [entries]);

  useEffect(() => {
    setCurrentMonthFirstDateDay(
      new Date(calendarState.year, calendarState.month, 1).getDay(),
    );
    setDaysInCurrentMonth(
      new Date(calendarState.year, calendarState.month + 1, 0).getDate(),
    );
  }, [calendarState.month, calendarState.year]);

  function next() {
    setDir(1);
    requestAnimationFrame(() => {
      setCalendarState((prev) => {
        const isDec = prev.month === 11;
        return {
          month: isDec ? 0 : prev.month + 1,
          year: isDec ? prev.year + 1 : prev.year,
        };
      });
    });
  }

  function today() {
    if (
      calendarState.year === currentDate.getFullYear() &&
      calendarState.month === currentDate.getMonth()
    )
      return;
    else if (calendarState.year < currentDate.getFullYear()) {
      setDir(1);
    } else if (
      calendarState.year === currentDate.getFullYear() &&
      calendarState.month < currentDate.getMonth()
    ) {
      setDir(1);
    } else setDir(-1);

    requestAnimationFrame(() => {
      setCalendarState({
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
      });
    });
  }

  function prev() {
    if (calendarState.month === 0 && calendarState.year <= oldestYearAvail) {
      toast.error(
        "Can't go to the past for more than 10 years, unless you have an entry earlier.",
        { richColors: true, position: "top-center", closeButton: true },
      );
      return;
    }

    setDir(-1);
    requestAnimationFrame(() => {
      setCalendarState((prev) => {
        const isJan = prev.month === 0;
        return {
          month: isJan ? 11 : prev.month - 1,
          year: isJan ? prev.year - 1 : prev.year,
        };
      });
    });
  }

  return isLoading || !entries || !entries.ok ? (
    <>
      <div className="flex w-full justify-center">
        <Spinner size={36} className="mt-4" />
      </div>
    </>
  ) : (
    <>
      <div className="w-full h-screen min-w-0 grid justify-center place-items-center align-middle">
        <div className="w-[95vw] md:w-[80vw] lg:w-[60vw] h-fit bg-white/5 rounded-2xl border-6 border-amber-600 place-items-center">
          <h1 className="text-xl md:text-3xl lg:text-5xl font-bold bg-black/90 p-2 px-4 md:p-5 md:px-8 rounded-xl text-amber-500 m-2 mb-3 md:m-4 md:mb-5">
            {currentUser.username}'s Calendar
          </h1>
          <div className="flex justify-between w-[90%] mt-4 px-[5%]">
            <AnimatePresence mode="wait">
              <motion.h2
                key={`${calendarState.month}-${calendarState.year}`}
                className="justify-self-start ml-4 text-lg md:text-2xl lg:text-3xl font-bold text-white"
                initial={{
                  x: dir === 0 ? 0 : dir > 0 ? 100 : -100,
                  opacity: dir === 0 ? 1 : 0,
                }}
                animate={{ x: 0, opacity: 1 }}
                exit={{
                  x: dir === 0 ? 0 : dir > 0 ? -100 : 100,
                  opacity: dir === 0 ? 1 : 0,
                }}
                transition={{ duration: 0.25 }}
              >
                {months.at(calendarState.month)}, {calendarState.year}
              </motion.h2>
            </AnimatePresence>
            <div className="flex justify-center">
              <div className="flex mr-4 justify-between place-items-center">
                {/* <button className="mr-[10%] font-bold text-lg text-white bg-amber-500 p-1.5 rounded-md hover:bg-amber-700  cursor-pointer duration-200">
                  Today
                </button> */}
                <Button
                  onClick={today}
                  className="mr-[10%] font-bold text-lg text-white bg-amber-500 p-2 rounded-md hover:bg-amber-700 hover:scale-110 cursor-pointer"
                >
                  Today
                </Button>
                <ChevronLeftIcon
                  className="w-[100%] text-amber-300 size-6 md:size-10 rounded-md hover:cursor-pointer hover:text-accent hover:bg-gray-700 duration-300 "
                  onClick={() => prev()}
                />
                <ChevronRightIcon
                  className="w-[100%] text-amber-300 size-6 md:size-10 ml-2 rounded-md hover:cursor-pointer hover:text-accent hover:bg-gray-700 duration-300"
                  onClick={() => next()}
                />
              </div>
            </div>
          </div>
          <div className="w-[90%] p-[5%]">
            <div
              id="weekdays"
              className="w-full mt-4 flex uppercase text-xs sm:text-sm md:text-xl lg:text-2xl font-bold text-amber-400"
            >
              {days.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${calendarState.month}-${calendarState.year}`}
                id="date"
                initial={{
                  x: dir === 0 ? 0 : dir > 0 ? 100 : -100,
                  opacity: dir === 0 ? 1 : 0,
                }}
                animate={{ x: 0, opacity: 1 }}
                exit={{
                  x: dir === 0 ? 0 : dir > 0 ? -100 : 100,
                  opacity: dir === 0 ? 1 : 0,
                }}
                transition={{ duration: 0.25 }}
                className={
                  "w-full h-full mt-6 grid grid-cols-7 gap-2 text-xl font-bold text-gray-800 animate-out"
                }
              >
                {[...Array(currentMonthFirstDateDay)].map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {[...Array(daysInCurrentMonth)].map((_, i) => (
                  <EachDate
                    key={i}
                    day={i}
                    currentDate={currentDate}
                    currentMonth={calendarState.month}
                    currentYear={calendarState.year}
                    entry={entries.data.find(
                      (entry) =>
                        entry.date ===
                        `${calendarState.year}-${
                          calendarState.month + 1 >= 10
                            ? calendarState.month + 1
                            : `0${calendarState.month + 1}`
                        }-${i + 1 >= 10 ? i + 1 : `0${i + 1}`}`,
                    )}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
