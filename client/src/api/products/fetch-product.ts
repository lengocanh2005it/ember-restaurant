import { FetchProductDto } from "@/api/products/utils/types";
import axios from "@/lib/axios";

export const handleFetchProduct = async (
  fetchProductDto: FetchProductDto
): Promise<any> => {
  try {
    const { productId, option } = fetchProductDto;

    const response = await axios.get(
      `/products/${productId}/?option=${option}`
    );

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
  }
};
