import axios from "@/lib/axios";
import { Theme } from "@/utils/types";

export const handleSwitchTheme = async (theme: Theme) => {
  try {
    const response = await axios.post("/auth/theme", theme);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
  }
};
