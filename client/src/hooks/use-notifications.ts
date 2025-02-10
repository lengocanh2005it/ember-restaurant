import { handleFetchNotifications } from "@/api/notifications/fetch-notifications";
import { CUSTOM_STALE_TIME } from "@/config/constants";
import { useQuery } from "@tanstack/react-query";

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: handleFetchNotifications,
    staleTime: CUSTOM_STALE_TIME,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
