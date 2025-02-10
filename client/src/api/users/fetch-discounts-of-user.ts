import axios from "@/lib/axios";

export const handleFetchDiscountOfUser = async (userId: string) => {
  try {
    const response = await axios.get(`/users/${userId}/?discounts=true`);

    return response.data.data;
  } catch (err) {
    console.error(err);
  }
};
