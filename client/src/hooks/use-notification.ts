import { handleFetchNotification } from "@/api/notifications/fetch-notification";
import { CUSTOM_STALE_TIME } from "@/config/constants";
import { useQuery } from "@tanstack/react-query";

export const useNotification = (notificationId: string) => {
  return useQuery({
    queryKey: ["notification", notificationId],
    queryFn: () => handleFetchNotification(notificationId),
    staleTime: CUSTOM_STALE_TIME,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
