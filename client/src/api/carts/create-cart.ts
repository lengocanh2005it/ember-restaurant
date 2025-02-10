import { CreateCartDto } from "@/api/carts/utils/types";
import axios from "@/lib/axios";

export const handleCreateCart = async (
  createCartDto: CreateCartDto
): Promise<any> => {
  try {
    const response = await axios.post("/carts", createCartDto);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
