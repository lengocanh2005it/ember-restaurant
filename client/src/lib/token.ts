import { handleLogout } from "@/api/logout/logout";
import axios from "@/lib/axios";
import { showErrorToast } from "@/utils";
import Cookies from "js-cookie";

const isTokenExpired = (): boolean => {
  let accessToken = "";

  if (Cookies.get("accessToken")) {
    accessToken = Cookies.get("accessToken")!;
  } else {
    accessToken = localStorage.getItem("accessToken")!;
  }

  if (!accessToken) throw new Error("Access token not found.");

  const payload = accessToken.split(".")[1];

  const decodedPayload = JSON.parse(atob(payload));

  if (decodedPayload.exp) {
    const expirationTime = decodedPayload.exp;

    const currentTime = Math.floor(Date.now() / 1000);

    if (currentTime >= expirationTime) {
      return true;
    }

    return false;
  } else throw new Error("Access token invalid!");
};

export const getValidAccessToken = async (): Promise<string> => {
  let accessToken = "";

  if (Cookies.get("accessToken")) {
    accessToken = Cookies.get("accessToken")!;
  } else {
    accessToken = localStorage.getItem("accessToken")!;
  }

  const isExpired = isTokenExpired();

  if (isExpired && accessToken) {
    try {
      const response = await axios.post("/auth/refresh", undefined, {
        withCredentials: true,
      });

      const data = response.data.data;

      if (data) {
        accessToken = data.accessToken;

        if (!Cookies.get("accessToken")) {
          localStorage.setItem("accessToken", accessToken);
        } else {
          Cookies.set("accessToken", accessToken);
        }
      } else {
        throw new Error("Unauthorized.");
      }
    } catch (error: any) {
      if (
        error.response?.status === 401 ||
        (error.response?.data?.message &&
          error.response?.data?.message.includes("Refresh token expired."))
      ) {
        await handleLogout();
        localStorage.removeItem("accessToken");
        Cookies.remove("accessToken");
        window.location.href = "/login";
        showErrorToast(
          "Your session has expired. Please log in again.",
          "bottom-right",
          {
            backgroundColor: "#dc3545",
            color: "#fff",
          }
        );
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  }

  if (!accessToken) throw new Error("No token found.");

  return accessToken;
};
