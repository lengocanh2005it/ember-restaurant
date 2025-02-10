import axios from "@/lib/axios";

export const handleDeleteEvent = async (eventId: string): Promise<any> => {
  try {
    const response = await axios.delete(`/events/${eventId}`);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
