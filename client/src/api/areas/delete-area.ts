import axios from "@/lib/axios";

export const handleDeleteArea = async (areaId: string): Promise<any> => {
  try {
    const response = await axios.delete(`/areas/${areaId}`);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
