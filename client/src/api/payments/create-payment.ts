import { CreatePaymentDetailsDto } from "@/api/payments/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleCreatePayment = async (
  createPaymentDetailsDto: CreatePaymentDetailsDto
): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const response = await axios.post(
      "/payments/card",
      createPaymentDetailsDto,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
