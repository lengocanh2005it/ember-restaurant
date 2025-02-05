import * as io from "socket.io-client";
import { Socket } from "socket.io-client";

let socket: typeof Socket | null = null;

export const connectSocket = (accessToken: string) => {
  if (socket && socket.connected) {
    return socket;
  }

  if (!socket) {
    socket = io.connect(
      process.env.NEXT_PUBLIC_NODE_ENV === "development"
        ? (process.env.NEXT_PUBLIC_BASE_DEV_URL as string)
        : (process.env.NEXT_PUBLIC_BASE_PROD_URL as string),
      {
        auth: {
          token: accessToken,
        },
      }
    );

    socket.on("connect", () => {});

    socket.on("disconnect", () => {});

    socket.on("error", (err: any) => {
      console.error("WebSocket error:", err);
    });
  }

  return socket;
};

export const subscribeToPaymentStatus = (callback: (data: any) => void) => {
  if (socket) {
    socket.on("paymentStatusUpdate", callback);
  } else {
    console.error("Socket is not connected.");
  }
};

export const emitCreatingPaymentOfUser = (type: "order" | "reservation") => {
  if (socket) {
    socket.emit("creatingPayment", { type });
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
