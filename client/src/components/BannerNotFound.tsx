import Image from "next/image";
import React from "react";

const BannerNotFound: React.FC = () => {
  return (
    <div
      className="relative lg:flex-row flex-col container mx-auto lg:px-20 px-10 py-3 
    flex items-center justify-between"
    >
      <div className="relative flex lg:flex-row flex-col items-center lg:gap-4 gap-2 text-center">
        <div className="relative w-[65px] h-[65px] rounded-full">
          <Image
            src={"/ember_logo.png"}
            alt=""
            priority
            sizes="(max-width:600px) 100vw, 50vw"
            fill
            className="
            object-cover select-none rounded-full"
          />
        </div>

        <h1 className="lg:text-xl text-base font-bold">
          <span className="text-accent">Ember.</span> Restaurant
        </h1>
      </div>

      <p className="lg:text-xl text-base">
        Since <span className="text-accent">2005.</span>
      </p>
    </div>
  );
};

export default BannerNotFound;
