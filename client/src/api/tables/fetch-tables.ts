import axios from "@/lib/axios";

export const handleFetchTables = async (option: string) => {
  try {
    const response = await axios.get(`/tables/?options=${option}`);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
