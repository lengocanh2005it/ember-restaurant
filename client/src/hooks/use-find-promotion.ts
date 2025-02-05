import { handleFindPromotion } from "@/api/promotions/find-promotion";
import { usePromotionStore } from "@/store";
import { Promotion } from "@/utils";
import { useMutation } from "@tanstack/react-query";

export const useFindPromotion = () => {
  const { setPromotions } = usePromotionStore();

  return useMutation({
    mutationFn: handleFindPromotion,
    onSuccess: (data: any) => {
      if (data) setPromotions(data as Promotion[]);
    },
  });
};
