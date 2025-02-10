import axios from "@/lib/axios";

export const handleFetchRequestsOfUser = async (
  userId: string
): Promise<any> => {
  try {
    const response = await axios.get(`/users/${userId}/?support_tickets=true`);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
