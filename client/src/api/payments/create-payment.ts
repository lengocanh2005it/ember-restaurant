import { CreatePaymentDto } from "@/api/payments/utils/types";
import axios from "@/lib/axios";

export const handleCreatePayment = async (
  createPaymentDto: CreatePaymentDto
): Promise<any> => {
  try {
    const response = await axios.post("/payments", createPaymentDto);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
