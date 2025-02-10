import axios from "@/lib/axios";

export const handleDeleteDiscount = async (
  discountId: string
): Promise<any> => {
  try {
    const response = await axios.delete(`/discounts/${discountId}`);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
