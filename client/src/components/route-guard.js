"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { DynamicIcon } from "./dynamic-icon";
import { toast } from "sonner";

// Define private routes that require authentication
const privateRoutes = [
  "/account",
  "/checkout",
  "/wishlist",
  "/shipping",
  "/cart",
  "/orders",
];

// Define auth routes that should redirect to dashboard if already logged in
const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export function RouteGuard({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [firstRun, setFirstRun] = useState(true);

  useEffect(() => {
    // Authentication check
    const authCheck = () => {
      // Skip verification for verification endpoints and public pages
      if (
        pathname.startsWith("/verify-email") ||
        pathname === "/" ||
        pathname.startsWith("/products") ||
        pathname.startsWith("/category") ||
        pathname.startsWith("/blog") ||
        pathname.startsWith("/about") ||
        pathname.startsWith("/contact") ||
        pathname.startsWith("/faqs")
      ) {
        setAuthorized(true);
        return;
      }

      // Check if route requires auth
      const isPrivateRoute = privateRoutes.some((route) =>
        pathname.startsWith(route)
      );

      // Check if route is an auth route (login, register, etc.)
      const isAuthRoute = authRoutes.some((route) =>
        pathname.startsWith(route)
      );

      if (isPrivateRoute && !isAuthenticated) {
        setAuthorized(false);
        // Show toast only if it's not the first run (to prevent showing on initial page load)
        if (!firstRun) {
          toast.error("Please log in to access this page");
        }
        router.push("/login");
      } else if (isAuthRoute && isAuthenticated) {
        setAuthorized(false);
        // Only show notification if not first run
        if (!firstRun) {
          toast.info("You are already logged in");
        }
        router.push("/account");
      } else {
        setAuthorized(true);
      }

      // After first run, clear flag
      if (firstRun) {
        setFirstRun(false);
      }
    };

    // Only run authCheck if we're not still loading auth state
    if (!loading) {
      authCheck();
    }
  }, [isAuthenticated, loading, pathname, router, firstRun]);

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized screen if not authenticated on private route
  if (!authorized && !loading) {
    // The redirect should handle this, but just in case, show a message
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="rounded-full bg-red-100 p-3 mx-auto w-fit">
            <DynamicIcon name="Lock" className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-gray-800">
            Access Restricted
          </h1>
          <p className="mt-2 text-gray-600">
            {privateRoutes.some((route) => pathname.startsWith(route))
              ? "Please log in to access this page"
              : "Redirecting to appropriate page..."}
          </p>
        </div>
      </div>
    );
  }

  // If authorized, render children
  return children;
}
