import axios from "@/lib/axios";

export const handleDeleteProduct = async (productId: string): Promise<any> => {
  try {
    const response = await axios.delete(`/products/${productId}`);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
