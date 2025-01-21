import { handleFetchProduct } from "@/api/products/fetch-product";
import { FetchProductDto } from "@/api/products/utils/types";
import { useQuery } from "@tanstack/react-query";

export const useProduct = (payload: FetchProductDto) => {
  return useQuery({
    queryKey: ["product", payload.productId],
    queryFn: () => handleFetchProduct(payload),
    staleTime: 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
