"use client";
import React, { useState } from "react";

// icons
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

// components
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DateSelect = () => {
  const [date, setDate] = useState<Date>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal flex gap-2 text-white/80 text-[16px] border-white/10",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="xl:h-4 xl:w-4 xl:block hidden" />
          {date ? format(date, "PPP") : "Choose a date"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateSelect;
