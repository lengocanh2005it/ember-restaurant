import React from "react";
import { Calendar } from "lucide-react";

const CurrentDate: React.FC = () => {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  const dateString = today.toLocaleDateString("en-GB", options);

  return (
    <div className="flex items-center lg:gap-3 gap-1 lg:justify-start justify-center lg:flex-row flex-col">
      <span className="text-base font-medium">{dateString}</span>
      <Calendar className="cursor-pointer" />
    </div>
  );
};

export default CurrentDate;
