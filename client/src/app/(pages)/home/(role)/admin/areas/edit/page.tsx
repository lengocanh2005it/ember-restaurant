"use client";
import EditAreaForm from "@/components/form/EditAreaForm";
import LoadingPage from "@/components/LoadingPage";
import { useAreaById } from "@/hooks/use-area";
import { Area } from "@/utils";
import React, { use, useEffect, useState } from "react";

const EditAreaPage: React.FC = (props: any) => {
  const [area, setArea] = useState<Area | null>(null);
  const searchParams = use<Record<string, string>>(props.searchParams);

  const { data, isLoading, isError } = useAreaById(searchParams.id);

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
    <main className="relative flex flex-col lg:gap-5 gap-3 lg:py-8 py-4 lg:px-6 px-4">
      <div
        className="flex flex-col lg:items-start items-center lg:justify-start 
        justify-center lg:text-left text-center"
      >
        <h1 className="lg:text-2xl text-xl uppercase font-bold">Edit Area</h1>

        <p className="lg:text-base text-[14px] dark:text-white/70 text-black/80">
          Manage and edit the reservation settings for your restaurant,
          including availability and seating preferences.
        </p>
      </div>

      {area && <EditAreaForm area={area} />}
    </main>
  );
};

export default EditAreaPage;
