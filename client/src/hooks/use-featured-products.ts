import { handleFetchFeaturedProducts } from "@/api/products/fetch-featured-products";
import { useQuery } from "@tanstack/react-query";

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ["featured-products"],
    queryFn: handleFetchFeaturedProducts,
    staleTime: 60 * 1000 * 20,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
