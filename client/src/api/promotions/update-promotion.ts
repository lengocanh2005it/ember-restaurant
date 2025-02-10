import { UpdatePromotionDto } from "@/api/promotions/utils/types";
import axios from "@/lib/axios";

export const handleUpdatePromotion = async (
  updatePromotionDto: UpdatePromotionDto
): Promise<any> => {
  try {
    const { promotionId, ...res } = updatePromotionDto;

    const response = await axios.patch(`/promotions/${promotionId}`, res);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
