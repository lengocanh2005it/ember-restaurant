import { handleFetchAreas } from "@/api/areas/fetch-areas";
import { useQuery } from "@tanstack/react-query";

export const useAreas = () => {
  return useQuery({
    queryKey: ["areas"],
    queryFn: handleFetchAreas,
    staleTime: 60 * 1000 * 20,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
