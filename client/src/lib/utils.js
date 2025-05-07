import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// API URL
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4005/api";

// API request helper with error handling
export async function fetchApi(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    let response = await fetch(url, config);

    // Handle token expiration
    if (
      response.status === 401 &&
      endpoint !== "/users/refresh-token" &&
      endpoint !== "/users/logout"
    ) {
      // Try to refresh the token
      try {
        const refreshResponse = await fetch(`${API_URL}/users/refresh-token`, {
          method: "POST",
          credentials: "include",
        });

        if (refreshResponse.ok) {
          // Token refreshed successfully, retry the original request
          response = await fetch(url, config);
        }
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        // If refresh fails, proceed with the original 401 response
      }
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Something went wrong");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Helper for getting auth token from cookies
export function getAuthToken() {
  if (typeof window !== "undefined") {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];
  }
  return null;
}

// Format currency
export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

// Format date
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Load an external script
export const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      reject(false);
    };
    document.body.appendChild(script);
  });
};
