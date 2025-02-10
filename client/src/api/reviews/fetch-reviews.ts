import axios from "@/lib/axios";

export const handleFetchReviews = async (isFeatured: string): Promise<any> => {
  try {
    const response = await axios.get(`/reviews/?featured=${isFeatured}`);

    if (!response.data) throw new Error("Internal Server Error.");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
