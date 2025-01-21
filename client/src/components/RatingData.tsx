"use client";
import { StarIcon } from "lucide-react";
import React from "react";
import CountUp from "react-countup";

const data = [
  { num: 5, amount: 1200, percent: 80, color: "#00b300" },
  { num: 4, amount: 50, percent: 25, color: "#aa00ff" },
  { num: 3, amount: 20, percent: 15, color: "#ffff80" },
  { num: 2, amount: 10, percent: 12, color: "#4da6ff" },
  { num: 1, amount: 2, percent: 10, color: "#ff704d" },
];

const RatingData: React.FC = () => {
  return (
    <div className="border border-white/20 p-6 rounded-[15px]">
      <div className="flex flex-col gap-4">
        {data.map((item: Record<string, string | number>, index) => {
          return (
            <div
              key={index}
              className="flex lg:flex-row flex-col lg:justify-between 
              relative gap-3"
            >
              <div className="flex lg:flex-row flex-col items-center gap-2 relative w-full">
                <CountUp
                  end={item.amount as number}
                  duration={5}
                  delay={2}
                  className="text-white/60 xl:text-2xl text-xl font-bold flex-1"
                />

                <div
                  className="bg-white/20 xl:h-[25px] h-[15px] 
                rounded-[15px] relative w-full"
                >
                  <span
                    className={`absolute left-0 h-full rounded-[15px]`}
                    style={{
                      width: `${item.percent}%`,
                      backgroundColor: `${item.color}`,
                    }}
                  ></span>
                </div>
              </div>

              <div
                className="flex items-center lg:w-[50%] w-full lg:justify-end justify-center
               xl:gap-2 gap-0"
              >
                {Array.from({ length: item.num as number }).map((_, index) => {
                  return (
                    <span
                      key={index}
                      className="text-yellow-400 xl:text-4xl text-2xl"
                    >
                      <StarIcon size={35} />
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RatingData;
