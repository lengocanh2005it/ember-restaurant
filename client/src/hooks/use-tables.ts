import { handleFetchTables } from "@/api/tables/fetch-tables";
import { useQuery } from "@tanstack/react-query";

export const useTables = (option: string) => {
  return useQuery({
    queryKey: ["tables"],
    queryFn: () => handleFetchTables(option),
    staleTime: 60 * 1000 * 20,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
