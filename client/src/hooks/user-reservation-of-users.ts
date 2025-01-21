import { handleFetchReservationOfUser } from "@/api/users/fetch-reservations-of-user";
import { useQuery } from "@tanstack/react-query";

export const useReservation = (userId: string) => {
  return useQuery({
    queryKey: ["reservations", userId],
    queryFn: () => handleFetchReservationOfUser(userId),
    staleTime: 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
