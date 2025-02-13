import { SESSION_EXPIRED } from "@/config/constants";
import { disconnectSocket } from "@/utils/socket";
import axios from "axios";

const instance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_BASE_PROD_URL
      : process.env.NEXT_PUBLIC_BASE_DEV_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const data = error.response.data;

      if (data && data.message && data.message.includes(SESSION_EXPIRED)) {
        localStorage.removeItem("user-storage");
        localStorage.removeItem("app-storage");
        disconnectSocket();
        window.location.href = "/login?error=ExpiredSession";
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
