"use client";
import LoadingPage from "@/components/LoadingPage";
import TableOfAreas from "@/components/TableOfAreas";
import { useAreas } from "@/hooks/use-areas";
import { Area } from "@/utils/types";
import { Button } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AreasPage: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [areas, setAreas] = useState<Area[]>([]);

  const { data, isLoading, isError } = useAreas();

  const handleClick = () => {
    router.push(`${pathname}/add`);
  };

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
        className="relative flex md:flex-row flex-col items-center md:justify-between justify-center
      gap-2"
      >
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

        <Button
          color="primary"
          className="dark:bg-white dark:text-black text-white"
          onPress={handleClick}
        >
          Add New Area
        </Button>
      </div>

      <TableOfAreas areas={areas} />
    </main>
  );
};

export default AreasPage;
