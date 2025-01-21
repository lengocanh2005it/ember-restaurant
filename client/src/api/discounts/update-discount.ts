import { UpdateDiscountDto } from "@/api/discounts/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleUpdateDiscount = async (
  updateDiscountDto: UpdateDiscountDto
): Promise<any> => {
  try {
    const { discountId, ...res } = updateDiscountDto;

    const accessToken = await getValidAccessToken();

    const response = await axios.patch(`/discounts/${discountId}`, res, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
