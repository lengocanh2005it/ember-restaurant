import { DeleteReviewDto } from "@/api/reviews/utils/types";
import axios from "@/lib/axios";

export const handleDeleteReview = async (
  deleteReviewDto: DeleteReviewDto
): Promise<any> => {
  try {
    const { reviewId, userId } = deleteReviewDto;

    const response = await axios.delete(
      `/reviews/${reviewId}/?userId=${userId}`
    );

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
