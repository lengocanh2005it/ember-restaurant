import axios from "@/lib/axios";

export const handleRedeemPoint = async (userId: string): Promise<any> => {
  try {
    const response = await axios.post(
      `/users/${userId}/?loyalty_points=true`,
      undefined
    );

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
