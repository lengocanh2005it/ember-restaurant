import axios from "@/lib/axios";

export const handleVerify2FaOfUser = async (otp: string): Promise<any> => {
  try {
    const response = await axios.post("/auth/verify/2fa", {
      otp,
    });

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
