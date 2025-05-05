"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { fetchApi } from "./utils";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on first load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First try to read from cookies to avoid unnecessary API calls
        const userSessionCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("user_session="));

        if (userSessionCookie) {
          try {
            // If we have a cookie, we're at least temporarily authenticated
            // and can avoid a loading flash
            const sessionData = JSON.parse(
              decodeURIComponent(userSessionCookie.split("=")[1])
            );
            if (sessionData.isAuthenticated) {
              // Make the API call to get full user data
              const res = await fetchApi("/users/me", {
                credentials: "include",
              });
              setUser(res.data.user);
              setLoading(false);
              return;
            }
          } catch (e) {
            // If cookie parsing failed, continue to API call
            console.error("Failed to parse user session cookie", e);
          }
        }

        // No valid cookie found, attempt API call with credentials
        const res = await fetchApi("/users/me", {
          credentials: "include",
        });
        setUser(res.data.user);
      } catch (err) {
        // API call failed, user is not authenticated
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchApi("/users/login", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      // Set user data from response
      setUser(res.data.user);

      // Create a local storage item as a backup
      if (typeof window !== "undefined") {
        localStorage.setItem("isLoggedIn", "true");
      }

      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchApi("/users/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });
      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      // First perform client-side logout regardless of API success
      setUser(null);

      // Clear local storage
      if (typeof window !== "undefined") {
        localStorage.removeItem("isLoggedIn");
      }

      // Manually clear cookies on the client side
      document.cookie =
        "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "user_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Then attempt the API call
      await fetchApi("/users/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error(
        "Logout API call failed, but client-side logout completed",
        err
      );
      // Don't set error since we've already done client-side logout
    } finally {
      setLoading(false);
    }
  };

  // Verify email
  const verifyEmail = async (token) => {
    setLoading(true);
    try {
      const res = await fetchApi(`/users/verify-email/${token}`, {
        method: "GET",
      });
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      const res = await fetchApi("/users/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    setLoading(true);
    try {
      const res = await fetchApi(`/users/reset-password/${token}`, {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (userData) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Add each key-value pair to formData
      Object.keys(userData).forEach((key) => {
        if (userData[key] !== undefined) {
          formData.append(key, userData[key]);
        }
      });

      const res = await fetchApi("/users/update-profile", {
        method: "PATCH",
        credentials: "include",
        headers: {
          // Don't set Content-Type as it's set automatically for FormData
        },
        body: formData,
      });

      setUser(res.data.user);
      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
    updateProfile,
    isAuthenticated:
      !!user ||
      (typeof window !== "undefined" &&
        localStorage.getItem("isLoggedIn") === "true"),
    // Add helper methods
    isCustomer: user?.role === "CUSTOMER",
    userId: user?.id,
    userName: user?.name,
    userEmail: user?.email,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
