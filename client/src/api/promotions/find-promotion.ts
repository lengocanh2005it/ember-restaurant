import axios from "@/lib/axios";

export const handleFindPromotion = async (
  promotionCode: string
): Promise<any> => {
  try {
    const response = await axios.get(
      `/promotions/?promotionCode=${promotionCode}`
    );

    if (!response.data) throw new Error("Promotion code not found.");

    return response.data.data;
  } catch (err) {
    throw err;
  }
};
