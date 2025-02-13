export const categories = [
  { key: "appetizer", label: "Appetizer" },
  { key: "dessert", label: "Dessert" },
  { key: "beverage", label: "Beverage" },
  { key: "hotpot", label: "Hot Pot" },
  { key: "main_course", label: "Main Courses" },
  { key: "signature_dishes", label: "Signature Dishes" },
  { key: "snack", label: "Snack" },
];

export const availabilities = [
  { key: "true", label: "True" },
  { key: "false", label: "False" },
];

export const types = [
  { key: "fixed", label: "Fixed Amount" },
  { key: "percentage", label: "Percentage" },
];

export const currencies = [
  { key: "vnd", label: "VND" },
  { key: "usd", label: "USD" },
];

export const statuses = [
  { key: "true", label: "Active" },
  { key: "false", label: "In Active" },
];

export const stageStatues = [
  { key: "pending", label: "Pending" },
  { key: "success", label: "Success" },
  { key: "error", label: "Error" },
];

export const areaOrTableStatues = [
  { key: "running", label: "Running" },
  { key: "maintenance", label: "Maintenance" },
];

export const statusOptions = [
  { name: "Success", uid: "success" },
  { name: "Error", uid: "error" },
  { name: "Pending", uid: "pending" },
];

export const MAX_VOUCHER_USAGE = 1;
export const MIN_ORDER_AMOUNT = 100000;
export const DEFAULT_STALE_TIME = 20 * 1000 * 60;
export const DEFAULT_GC_TIME = 60 * 1000 * 15;
export const CUSTOM_STALE_TIME = 20 * 1000 * 60;
export const SESSION_EXPIRED = "Session is expired.";
