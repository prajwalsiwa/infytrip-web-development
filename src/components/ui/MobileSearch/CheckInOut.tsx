/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { eachDayOfInterval, format, isSameDay } from "date-fns";
import { DateRange } from "react-day-picker";
import { MdDateRange } from "react-icons/md";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CheckInOutPropsTypes {
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  className?: string;
  showLabel?: boolean;
  onChange?: (dateRange: DateRange) => void;
}

export default function CheckInOut({
  date,
  setDate,
  className,
  showLabel = true,
  onChange,
}: CheckInOutPropsTypes) {
  const handleDateChange = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
    if (selectedDate && onChange) {
      onChange(selectedDate);
    }
  };

  // Get the in-between dates (excluding start and end)
  const inRange =
    date?.from && date.to
      ? eachDayOfInterval({ start: date.from, end: date.to }).filter(
          (d) => !isSameDay(d, date.from!) && !isSameDay(d, date.to!)
        )
      : [];
  return (
    <div className={cn("w-full  rounded-lg", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <button
            id="date"
            className={cn("h-[42px] w-full rounded-lg ", className)}
          >
            <div className="bg-white flex items-center px-3 w-full rounded-sm justify-start gap-2">
              <MdDateRange className="size-5 text-gray mt-[2px]" />
              <div className="text-start h-10 items-center flex w-full">
                <p className="text-sm w-full flex items-center mt-1">
                  {date?.from ? (
                    date.to ? (
                      <>
                        {showLabel ? (
                          <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}{" "}
                          </>
                        ) : (
                          <>
                            {format(date.from, "LLL dd")} -{" "}
                            {format(date.to, "LLL dd")}{" "}
                          </>
                        )}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span className="text-start text-gray">Check In-Out</span>
                  )}
                </p>
              </div>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            numberOfMonths={2}
            onSelect={handleDateChange}
            modifiers={{
              inRange,
            }}
            modifiersClassNames={{
              inRange: "!bg-blue-300 ", // light blue highlight
              selected: "hover:bg-blue-400 bg-blue-400", // start and end
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
