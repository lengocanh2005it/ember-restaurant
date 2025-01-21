import axios from "@/lib/axios";
import { Theme } from "@/utils/types";

export const handleSwitchTheme = async (theme: Theme) => {
  try {
    await axios.post("/auth/theme", theme, {
      withCredentials: true,
    });
  } catch (err) {
    console.error(err);
  }
};
