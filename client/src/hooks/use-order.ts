import { handleFetchOrder } from "@/api/orders/fetch-order";
import { CUSTOM_STALE_TIME } from "@/config/constants";
import { useQuery } from "@tanstack/react-query";

export const useOrderById = (orderId: string) => {
  return useQuery({
    queryKey: ["orderById", orderId],
    queryFn: () => handleFetchOrder(orderId),
    staleTime: CUSTOM_STALE_TIME,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
