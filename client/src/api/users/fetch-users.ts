import axios from "@/lib/axios";

export const handleFetchUsers = async (): Promise<any> => {
  try {
    const response = await axios.get("/users");

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
