import axios from "@/lib/axios";

export const handleFetchRolesOfUser = async (): Promise<any> => {
  try {
    const response = await axios.get("/auth/role");

    if (!response.data) throw new Error("Internal Server Error");

    return response;
  } catch (err) {
    console.error(err);
  }
};
