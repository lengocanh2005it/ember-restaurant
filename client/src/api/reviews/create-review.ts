import { CreateReviewDto } from "@/api/reviews/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";
import { AxiosResponse } from "axios";

export const handleCreateReview = async (
  createReviewDto: CreateReviewDto
): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const response = await axios.post("/reviews", createReviewDto, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.data) throw new Error("Internal Server Error.");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
