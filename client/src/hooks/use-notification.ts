import { handleFetchNotification } from "@/api/notifications/fetch-notification";
import { CUSTOM_STALE_TIME } from "@/config/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useNotification = (notificationId: string) => {
  const query = useQueryClient();

  return useQuery({
    queryKey: ["notifications", notificationId],
    queryFn: async () => {
      const data = await handleFetchNotification(notificationId);

      query.setQueryData(["notifications"], data.notifications);

      return data.notification;
    },
    staleTime: CUSTOM_STALE_TIME,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
