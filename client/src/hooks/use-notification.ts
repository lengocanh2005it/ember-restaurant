import { handleFetchNotification } from "@/api/notifications/fetch-notification";
import { useQuery } from "@tanstack/react-query";

export const useNotification = (notificationId: string) => {
  return useQuery({
    queryKey: ["notification", notificationId],
    queryFn: () => handleFetchNotification(notificationId),
    staleTime: 60 * 1000 * 20,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
