import { CreateUserDto } from "@/api/register/utils/types";
import axios from "@/lib/axios";

export const handleRegister = async (
  createUserDto: CreateUserDto
): Promise<any> => {
  try {
    const response = await axios.post("/users", createUserDto);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
