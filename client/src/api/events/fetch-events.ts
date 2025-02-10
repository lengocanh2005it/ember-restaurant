import axios from "@/lib/axios";

export const handleFetchEvents = async (): Promise<any> => {
  try {
    const response = await axios.get("/events");

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
