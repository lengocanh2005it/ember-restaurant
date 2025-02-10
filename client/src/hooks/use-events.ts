import { handleFetchEvents } from "@/api/events/fetch-events";
import { CUSTOM_STALE_TIME } from "@/config/constants";
import { useQuery } from "@tanstack/react-query";

export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: handleFetchEvents,
    staleTime: CUSTOM_STALE_TIME,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
