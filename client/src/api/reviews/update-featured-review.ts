import { UpdateFeaturedReviewDto } from "@/api/reviews/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleUpdateFeaturedReviews = async (
  updateFeaturedReviews: UpdateFeaturedReviewDto
): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const response = await axios.patch(
      "reviews/featured",
      updateFeaturedReviews,
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
