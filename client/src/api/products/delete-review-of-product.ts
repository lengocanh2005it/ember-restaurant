import { DeleteReviewOfProductDto } from "@/api/products/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleDeleteReviewsOfProducts = async (
  deleteReviewOfProductDto: DeleteReviewOfProductDto
): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const { productId, reviewId, option } = deleteReviewOfProductDto;

    const response = await axios.delete(
      `/products/delete-reviews/${productId}/?reviewId=${reviewId}&option=${option}`,
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
    throw err;
  }
};
