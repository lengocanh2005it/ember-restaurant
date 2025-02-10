import { CreateDiscountDto } from "@/api/discounts/utils/types";
import axios from "@/lib/axios";

export const handleCreateDiscount = async (
  createDiscountDto: CreateDiscountDto
): Promise<any> => {
  try {
    const response = await axios.post("/discounts", createDiscountDto);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
