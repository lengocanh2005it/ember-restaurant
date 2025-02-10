import { CreateReviewDto } from "@/api/reviews/utils/types";
import axios from "@/lib/axios";

export const handleCreateReview = async (
  createReviewDto: CreateReviewDto
): Promise<any> => {
  try {
    const response = await axios.post("/reviews", createReviewDto);

    if (!response.data) throw new Error("Internal Server Error.");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
