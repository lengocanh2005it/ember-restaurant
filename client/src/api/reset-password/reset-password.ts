import {
  ResetPasswordDto,
  SendEmailDto,
} from "@/api/reset-password/utils/types";
import axios from "@/lib/axios";

export const handleSendEmail = async (
  sendEmailDto: SendEmailDto
): Promise<any> => {
  try {
    const response = await axios.post(
      "/auth/request/reset-password",
      sendEmailDto
    );

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const handleResetPassword = async (
  resetPasswordDto: ResetPasswordDto
): Promise<any> => {
  try {
    const response = await axios.post("/auth/reset-password", resetPasswordDto);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
