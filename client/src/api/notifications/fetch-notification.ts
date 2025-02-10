import axios from "@/lib/axios";

export const handleFetchNotification = async (
  notificationId: string
): Promise<any> => {
  try {
    const response = await axios.get(`/notifications/${notificationId}`);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
