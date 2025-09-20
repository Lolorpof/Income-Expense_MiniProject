import { useEffect, useState } from "react";
import { ChevronRightIcon, ChevronLeftIcon } from "lucide-react";
import "./calendar.css";
import { days, months } from "@/utils/calendar/calendar.util";
import type { TUser } from "@/types/user.type";
import { useQuery, type QueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import EachDate from "./EachDate";
import { getAllEntriesDateIdByUserId } from "@/fetching/queries/getAllEntriesDateIdByUserId";
import { Spinner } from "../ui/spinner";
import dayjs from "dayjs";

export default function Calendar({
  prevDateState,
  currentUser,
  queryClient,
}: {
  prevDateState?: string;
  currentUser: TUser;
  queryClient: QueryClient;
}) {
  const currentDate = new Date();
  const prevDate = prevDateState ? dayjs(prevDateState).toDate() : undefined;
  const [dir, setDir] = useState(0);
  const [calendarState, setCalendarState] = useState(() => ({
    month: prevDate ? prevDate.getMonth() : currentDate.getMonth(),
    year: prevDate ? prevDate.getFullYear() : currentDate.getFullYear(),
  }));

  const [currentMonthFirstDateDay, setCurrentMonthFirstDateDay] = useState(
    new Date(calendarState.year, calendarState.month, 1).getDay()
  );
  const [daysInCurrentMonth, setDaysInCurrentMonth] = useState(
    new Date(calendarState.year, calendarState.month + 1, 0).getDate()
  );

  const { data: entries, isLoading } = useQuery(
    getAllEntriesDateIdByUserId(currentUser.id)
  );

  useEffect(() => {
    setCurrentMonthFirstDateDay(
      new Date(calendarState.year, calendarState.month, 1).getDay()
    );
    setDaysInCurrentMonth(
      new Date(calendarState.year, calendarState.month + 1, 0).getDate()
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

  function prev() {
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
      <div className="w-full h-screen min-w-[50vw] grid justify-center place-items-center align-middle">
        <div className="w-[60vw] h-fit bg-white/5 rounded-2xl border-6 border-amber-600 place-items-center">
          <h1 className="text-5xl font-bold bg-black/90 p-5 px-8 rounded-xl text-amber-500 m-4 mb-5">
            {currentUser.username}'s Calendar
          </h1>
          <div className="flex justify-between w-[90%] mt-4 px-[5%]">
            <AnimatePresence mode="wait">
              <motion.h2
                key={`${calendarState.month}-${calendarState.year}`}
                className="justify-self-start ml-4 text-3xl font-bold text-white"
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
                <ChevronLeftIcon
                  className="w-[100%] text-amber-300 size-10 rounded-md hover:cursor-pointer hover:text-accent hover:bg-gray-700 duration-300 "
                  onClick={() => prev()}
                />
                <ChevronRightIcon
                  className="w-[100%] text-amber-300 size-10 ml-2 rounded-md hover:cursor-pointer hover:text-accent hover:bg-gray-700 duration-300"
                  onClick={() => next()}
                />
              </div>
            </div>
          </div>
          <div className="w-[90%] p-[5%]">
            <div
              id="weekdays"
              className="w-full mt-4 flex uppercase text-2xl font-bold text-amber-400"
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
                        }-${i + 1 >= 10 ? i + 1 : `0${i + 1}`}`
                    )}
                    queryClient={queryClient}
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
