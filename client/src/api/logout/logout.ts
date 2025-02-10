import axios from "@/lib/axios";

export const handleLogout = async (): Promise<any> => {
  try {
    const response = await axios.post("/auth/logout", undefined);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
