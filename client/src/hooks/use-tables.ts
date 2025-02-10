import { handleFetchTables } from "@/api/tables/fetch-tables";
import { CUSTOM_STALE_TIME } from "@/config/constants";
import { useQuery } from "@tanstack/react-query";

export const useTables = (option: string) => {
  return useQuery({
    queryKey: ["tables"],
    queryFn: () => handleFetchTables(option),
    staleTime: CUSTOM_STALE_TIME,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
