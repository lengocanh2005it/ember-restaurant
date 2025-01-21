"use client";
import LoadingPage from "@/components/LoadingPage";
import TableOfAreas from "@/components/TableOfAreas";
import { useAreas } from "@/hooks/use-areas";
import { Area } from "@/utils/types";
import React, { useEffect, useState } from "react";

const AreasPage: React.FC = () => {
  const [areas, setAreas] = useState<Area[]>([]);

  const { data, isLoading, isError } = useAreas();

  useEffect(() => {
    if (data) {
      setAreas(data as Area[]);
    }
  }, [data]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <main className="relative container lg:px-6 py-4 flex flex-col lg:gap-4 gap-2">
      <div
        className="flex flex-col lg:items-start items-center lg:justify-start 
        justify-center lg:text-left text-center"
      >
        <h1 className="lg:text-2xl text-xl uppercase font-bold">
          List Of Areas
        </h1>

        <p className="lg:text-base text-[14px] dark:text-white/70 text-black/80">
          Here is the list of all areas of Ember. Restaurant.
        </p>
      </div>

      <TableOfAreas areas={areas} />
    </main>
  );
};

export default AreasPage;
