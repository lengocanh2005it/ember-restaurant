import { handleFetchAreaById } from "@/api/areas/fetch-area";
import { CUSTOM_STALE_TIME } from "@/config/constants";
import { useQuery } from "@tanstack/react-query";

export const useAreaById = (areaId: string) => {
  return useQuery({
    queryKey: ["area", areaId],
    queryFn: () => handleFetchAreaById(areaId),
    staleTime: CUSTOM_STALE_TIME,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
