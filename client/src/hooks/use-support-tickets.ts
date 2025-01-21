import { handleFetchSupportTickets } from "@/api/support-ticket/fetch-support-tickets";
import { useQuery } from "@tanstack/react-query";

export const useRequests = () => {
  return useQuery({
    queryKey: ["support-tickets"],
    queryFn: handleFetchSupportTickets,
    staleTime: 60 * 1000 * 20,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
