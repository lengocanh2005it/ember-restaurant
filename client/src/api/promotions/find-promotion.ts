import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleFindPromotion = async (
  promotionCode: string
): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const response = await axios.get(
      `/promotions/?promotionCode=${promotionCode}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.data) throw new Error("Promotion code not found.");

    return response.data.data;
  } catch (err) {
    throw err;
  }
};
