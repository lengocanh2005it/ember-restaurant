import { handleFetchEvents } from "@/api/events/fetch-events";
import { useQuery } from "@tanstack/react-query";

export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: handleFetchEvents,
    staleTime: 60 * 1000 * 20,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
