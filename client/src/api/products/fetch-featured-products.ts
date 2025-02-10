import axios from "@/lib/axios";

export const handleFetchFeaturedProducts = async (): Promise<any> => {
  try {
    const response = await axios.get("/products/?featured=true");

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
