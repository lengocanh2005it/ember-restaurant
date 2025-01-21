import { UpdateProductDto } from "@/api/products/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleUpdateProduct = async (
  updateProductDto: UpdateProductDto
): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const { id, ...res } = updateProductDto;

    const response = await axios.patch(`/products/${id}`, res, {
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
