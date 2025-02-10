import axios from "@/lib/axios";

export const handleFetchProducts = async (): Promise<any> => {
  try {
    const response = await axios.get("/products");

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};
