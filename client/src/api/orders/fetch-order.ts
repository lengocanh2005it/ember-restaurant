import axios from "@/lib/axios";

export const handleFetchOrder = async (orderId: string): Promise<any> => {
  try {
    const response = await axios.get(`/orders/${orderId}`);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
