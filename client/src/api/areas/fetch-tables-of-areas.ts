import axios from "@/lib/axios";

export const handleFetchTablesOfAreas = async (
  areaId: string
): Promise<any> => {
  try {
    const response = await axios.get(`/areas/${areaId}`);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
