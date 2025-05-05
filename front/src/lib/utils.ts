import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency with ₹ symbol
export function formatCurrency(
  amount: number | string | undefined | null
): string {
  if (amount === undefined || amount === null) {
    return "₹0.00";
  }

  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

// Debug utility to help inspect data in components
export function debugData(label: string, data: any, always: boolean = false) {
  // Only log in development environment or if always flag is true
  if ((import.meta.env.DEV || always) && data !== undefined) {
    console.group(`🔍 DEBUG: ${label}`);
    console.log(data);
    if (typeof data === "object" && data !== null) {
      console.log("Keys:", Object.keys(data));
    }
    console.groupEnd();
  }
}
