import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";
import { getSession } from "next-auth/react";

export const handleFetchProfileOfUser = async () => {
  try {
    const session = await getSession();

    const accessToken =
      session && session.user.accessToken
        ? session.user.accessToken
        : await getValidAccessToken();

    const response = await axios.get("/auth/profile", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.data;
  } catch (err) {
    console.error(err);
  }
};
