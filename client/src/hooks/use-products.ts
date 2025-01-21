import { handleFetchProducts } from "@/api/products/fetch-products";
import { useQuery } from "@tanstack/react-query";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: handleFetchProducts,
    staleTime: 60 * 1000 * 15,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
