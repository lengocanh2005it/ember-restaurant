import axios from "@/lib/axios";

export const handleFetchReservationOfUser = async (
  userId: string
): Promise<any> => {
  try {
    const response = await axios.get(`/users/${userId}/?reservations=true`);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
