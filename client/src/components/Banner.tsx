"use client";
import CurrentDate from "@/components/CurrentDate";
import { useAppStore, useUserStore } from "@/store";
import React from "react";

const Banner: React.FC = () => {
  const { user } = useUserStore();
  const { isAdmin } = useAppStore();

  return (
    <div
      className="flex md:flex-row dark:text-white
     dark:bg-primary flex-col items-center md:gap-1 gap-3 text-xl container
     md:p-4 p-2 justify-between md:px-6 px-2"
    >
      <h3
        className="lg:text-base text-xl lg:text-nowrap text-wrap md:text-left text-center flex lg:flex-row
       flex-col items-center lg:gap-2"
      >
        <span className="dark:text-white/70 text-black/80">Welcome back,</span>{" "}
        {isAdmin && " Admin,"}{" "}
        <span className="lg:text-2xl text-3xl font-bold">
          {user?.name ? user.name + "!" : user?.username + "!"}
        </span>
      </h3>

      <CurrentDate />
    </div>
  );
};

export default Banner;
