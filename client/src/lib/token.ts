import axios from "@/lib/axios";
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
    } catch (error) {
      if ((error as Error).message === "Unauthorized") {
        window.location.href = "/login";
        axios
          .post("/auth/logout", null, {
            withCredentials: true,
          })
          .then((response) => {
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        console.error("Has error:", error);
      }
    }
  }

  if (!accessToken) throw new Error("No token found.");

  return accessToken;
};
