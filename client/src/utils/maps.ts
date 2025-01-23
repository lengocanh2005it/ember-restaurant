import { ChipProps } from "@heroui/react";

export const methodMap = {
  card: "Credit Card",
  cash: "Pay In Cash",
};

export const deliveryMap = {
  home_delivery: "Home Delivery",
  pick_up: "Pick Up",
};

export const statusMap = {
  pending: "Pending",
  success: "Success",
  error: "Error",
};

export const statusColorMap: Record<string, ChipProps["color"]> = {
  pending: "warning",
  success: "success",
  error: "danger",
};

export const typeMap = {
  vip: "VIP",
  normal: "Normal",
};
