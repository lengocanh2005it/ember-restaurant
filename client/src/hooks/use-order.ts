import { handleFetchOrder } from "@/api/orders/fetch-order";
import { useQuery } from "@tanstack/react-query";

export const useOrderById = (orderId: string) => {
  return useQuery({
    queryKey: ["orderById", orderId],
    queryFn: () => handleFetchOrder(orderId),
    staleTime: 60 * 1000 * 20,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
