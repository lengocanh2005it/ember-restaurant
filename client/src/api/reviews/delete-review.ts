import { DeleteReviewDto } from "@/api/reviews/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleDeleteReview = async (
  deleteReviewDto: DeleteReviewDto
): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const { reviewId, userId } = deleteReviewDto;

    const response = await axios.delete(
      `/reviews/${reviewId}/?userId=${userId}`,
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
