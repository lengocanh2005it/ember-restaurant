import axios from "@/lib/axios";
import { AxiosResponse } from "axios";

export const handleFetchDiscounts = async (): Promise<any> => {
  try {
    const response = await axios.get("/discounts");

    if (!response.data) throw new Error("Internal Sever Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
  }
};
