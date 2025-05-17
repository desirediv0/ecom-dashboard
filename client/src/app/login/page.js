"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { AuthRedirect } from "@/components/auth-redirect";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    setIsSubmitting(true);

    try {
      await login(email, password);

      // Show success message
      toast.success("Logged in successfully");

      // Get redirect URL from query parameters if available
      const redirect = searchParams.get("redirect");

      // Redirect after a small delay to allow toast to be seen
      setTimeout(() => {
        if (redirect) {
          router.push(`/${redirect}`);
        } else {
          router.push("/");
        }
      }, 500);
    } catch (error) {
      const errorMessage =
        error.message || "Login failed. Please check your credentials.";

      // Check if error is related to email verification
      if (
        errorMessage.toLowerCase().includes("verify") ||
        errorMessage.toLowerCase().includes("verification")
      ) {
        toast.error(
          <div>
            {errorMessage}{" "}
            <Link
              href="/resend-verification"
              className="text-white font-medium underline"
            >
              Resend verification email
            </Link>
          </div>
        );
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthRedirect>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">Login</h1>
            <p className="mt-2 text-gray-600">
              Sign in to your account to continue
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Register now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </AuthRedirect>
  );
}
