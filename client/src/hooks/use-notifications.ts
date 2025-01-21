import { handleFetchNotifications } from "@/api/notifications/fetch-notifications";
import { useQuery } from "@tanstack/react-query";

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: handleFetchNotifications,
    staleTime: 60 * 1000 * 20,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
