import { handleFetchSupportTickets } from "@/api/support-ticket/fetch-support-tickets";
import { CUSTOM_STALE_TIME } from "@/config/constants";
import { useQuery } from "@tanstack/react-query";

export const useRequests = () => {
  return useQuery({
    queryKey: ["support-tickets"],
    queryFn: handleFetchSupportTickets,
    staleTime: CUSTOM_STALE_TIME,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
