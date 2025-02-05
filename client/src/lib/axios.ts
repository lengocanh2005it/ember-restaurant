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

export default instance;
