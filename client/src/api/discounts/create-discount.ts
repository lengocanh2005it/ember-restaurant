import { CreateDiscountDto } from "@/api/discounts/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleCreateDiscount = async (
  createDiscountDto: CreateDiscountDto
): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const response = await axios.post("/discounts", createDiscountDto, {
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
