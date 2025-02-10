import axios from "@/lib/axios";

export const handleDeletePromotion = async (
  promotionId: string
): Promise<any> => {
  try {
    const response = await axios.delete(`/promotions/${promotionId}`);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
