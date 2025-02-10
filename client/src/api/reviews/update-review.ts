import { UpdateReviewDto } from "@/api/reviews/utils/types";
import axios from "@/lib/axios";

export const handleUpdateReview = async (updateReviewDto: UpdateReviewDto) => {
  try {
    const response = await axios.patch(`/reviews`, updateReviewDto);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
