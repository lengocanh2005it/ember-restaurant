import axios from "@/lib/axios";

export const handleSentOTPToEmail = async (email: string): Promise<any> => {
  try {
    const response = await axios.post("auth/otp", { email });

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
