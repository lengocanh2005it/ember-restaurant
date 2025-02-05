import axios from "@/lib/axios";

export const handleFetchProfileOfUser = async () => {
  try {
    const response = await axios.get("/auth/profile");

    return response.data.data;
  } catch (err) {
    console.error(err);
  }
};
