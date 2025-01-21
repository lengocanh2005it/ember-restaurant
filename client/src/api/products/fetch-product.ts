import { FetchProductDto } from "@/api/products/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleFetchProduct = async (
  fetchProductDto: FetchProductDto
): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const { productId, option } = fetchProductDto;

    const response = await axios.get(
      `/products/${productId}/?option=${option}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
  }
};
