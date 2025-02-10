import { DeleteReviewOfProductDto } from "@/api/products/utils/types";
import axios from "@/lib/axios";

export const handleDeleteReviewsOfProducts = async (
  deleteReviewOfProductDto: DeleteReviewOfProductDto
): Promise<any> => {
  try {
    const { productId, reviewId, option } = deleteReviewOfProductDto;

    const response = await axios.delete(
      `/products/delete-reviews/${productId}/?reviewId=${reviewId}&option=${option}`
    );

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
