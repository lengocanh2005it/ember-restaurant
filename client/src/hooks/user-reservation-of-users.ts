import { handleFetchReservationOfUser } from "@/api/users/fetch-reservations-of-user";
import { CUSTOM_STALE_TIME } from "@/config/constants";
import { useQuery } from "@tanstack/react-query";

export const useReservation = (userId: string) => {
  return useQuery({
    queryKey: ["reservations", userId],
    queryFn: () => handleFetchReservationOfUser(userId),
    staleTime: CUSTOM_STALE_TIME,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
