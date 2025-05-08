// API base URL configuration
export const API_URL =
  process.env.NODE_ENV === "production"
    ? "http://a.desirediv.com/api"
    : "http://localhost:4005/api";
