"use client";
import LoadingPage from "@/components/LoadingPage";
import TablesDetailsOfArea from "@/components/TablesDetailsOfArea";
import { useAreaById } from "@/hooks/use-area";
import { Area } from "@/utils";
import React, { use, useEffect, useState } from "react";

const AllTablesOfAreaDetailsPage: React.FC = (props: any) => {
  const [area, setArea] = useState<Area | null>(null);
  const searchParams = use<Record<string, string>>(props.searchParams);

  const { data, isLoading, isError } = useAreaById(searchParams.areaId);

  useEffect(() => {
    if (data) {
      setArea(data as Area);
    }
  }, [data]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <main className="container mx-auto px-4 py-6 relative w-full flex flex-col lg:gap-6 gap-4">
      <div
        className="flex flex-col lg:items-start items-center lg:justify-start justify-center
          lg:text-left text-center"
      >
        <h1 className="lg:text-xl text-base uppercase font-bold">
          All Tables Details Of Area
        </h1>

        <p className="lg:text-base text-[14px] dark:text-white/70 text-black/70">
          Here is a detailed list of the tables in the area, you can easily edit
          or delete these tables.
        </p>
      </div>

      {area && <TablesDetailsOfArea area={area} />}
    </main>
  );
};

export default AllTablesOfAreaDetailsPage;
