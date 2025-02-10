import axios from "@/lib/axios";

export const handleDeleteNotification = async (
  notificationId: string
): Promise<any> => {
  try {
    const response = await axios.delete(`/notifications/${notificationId}`);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
