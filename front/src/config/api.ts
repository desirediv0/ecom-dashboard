// API base URL configuration
export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://genuinenutrition.com/api"
    : "http://localhost:4000/api";
