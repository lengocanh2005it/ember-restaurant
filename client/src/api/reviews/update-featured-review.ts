import { UpdateFeaturedReviewDto } from "@/api/reviews/utils/types";
import axios from "@/lib/axios";

export const handleUpdateFeaturedReviews = async (
  updateFeaturedReviews: UpdateFeaturedReviewDto
): Promise<any> => {
  try {
    const response = await axios.patch(
      "reviews/featured",
      updateFeaturedReviews
    );

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
