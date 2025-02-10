import axios from "@/lib/axios";

export const handleDeleteUser = async (userId: string): Promise<any> => {
  try {
    const response = await axios.delete(`/users/${userId}`);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
