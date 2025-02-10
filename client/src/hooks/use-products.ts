import { handleFetchProducts } from "@/api/products/fetch-products";
import { CUSTOM_STALE_TIME } from "@/config/constants";
import { useQuery } from "@tanstack/react-query";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: handleFetchProducts,
    staleTime: CUSTOM_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};
