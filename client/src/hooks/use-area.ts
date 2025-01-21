import { handleFetchAreaById } from "@/api/areas/fetch-area";
import { useQuery } from "@tanstack/react-query";

export const useAreaById = (areaId: string) => {
  return useQuery({
    queryKey: ["area", areaId],
    queryFn: () => handleFetchAreaById(areaId),
    staleTime: 20 * 1000 * 60,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
