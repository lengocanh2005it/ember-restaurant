import { handleFetchAreas } from "@/api/areas/fetch-areas";
import { CUSTOM_STALE_TIME } from "@/config/constants";
import { useQuery } from "@tanstack/react-query";

export const useAreas = () => {
  return useQuery({
    queryKey: ["areas"],
    queryFn: handleFetchAreas,
    staleTime: CUSTOM_STALE_TIME,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
