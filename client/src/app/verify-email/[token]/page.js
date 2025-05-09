"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { ClientOnly } from "@/components/client-only";
import { DynamicIcon } from "@/components/dynamic-icon";

export default function VerifyEmailPage({ params }) {
  const { token } = params;
  const { verifyEmail, resendVerification } = useAuth();
  const [status, setStatus] = useState("initial"); // initial, verifying, success, error, resent
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);

  // Use a ref to ensure verification is only attempted once
  const verificationAttemptedRef = useRef(false);
  // Track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);

  useEffect(() => {
    // Set mounted flag
    isMounted.current = true;

    // Cleanup function
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Only run once and only if we're in the initial state
    if (status !== "initial" || verificationAttemptedRef.current || !token) {
      return;
    }

    const verify = async () => {
      // Mark that verification has been attempted
      verificationAttemptedRef.current = true;

      // Set state to verifying
      if (isMounted.current) {
        setStatus("verifying");
      }

      try {
        const response = await verifyEmail(token);

        // Only update state if component is still mounted
        if (isMounted.current) {
          setStatus("success");
          setMessage(response.message || "Email verified successfully");
        }
      } catch (error) {
        console.error("Verification error:", error);

        // Only update state if component is still mounted
        if (!isMounted.current) return;

        // Special case: If the error is that the email was already verified,
        // treat it as a success
        if (
          error.message &&
          error.message.toLowerCase().includes("already verified")
        ) {
          setStatus("success");
          setMessage("Your email has already been verified");
        } else if (
          error.message &&
          error.message.includes("Verification already attempted")
        ) {
          // Handle case where token was already attempted (from our auth context check)
          setStatus("error");
          setMessage(
            "This verification link has already been used. Please try logging in or request a new verification email."
          );
        } else {
          setStatus("error");
          setMessage(
            error.message ||
              "Unable to verify email. The token may be invalid or expired."
          );
        }
      }
    };

    // Start verification process
    verify();
  }, [token, verifyEmail, status]);

  const handleResendVerification = async (e) => {
    e.preventDefault();
    if (!email) return;

    setResending(true);
    try {
      await resendVerification(email);

      if (isMounted.current) {
        setStatus("resent");
        setMessage(
          "Verification email has been resent. Please check your inbox."
        );
      }
    } catch (error) {
      if (isMounted.current) {
        setMessage(error.message || "Failed to resend verification email");
      }
    } finally {
      if (isMounted.current) {
        setResending(false);
      }
    }
  };

  return (
    <div className="container max-w-lg mx-auto p-8">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>

        <ClientOnly fallback={<div className="py-8">Loading...</div>}>
          {(status === "initial" || status === "verifying") && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600">Verifying your email...</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="rounded-full bg-green-100 p-3">
                <DynamicIcon
                  name="Check"
                  className="h-12 w-12 text-green-500"
                />
              </div>
              <p className="mt-4 text-green-600 font-medium">{message}</p>
              <p className="mt-2 text-gray-600">
                Your email has been verified successfully.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Continue to Login{" "}
                <DynamicIcon name="ArrowRight" className="ml-2 h-4 w-4" />
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="rounded-full bg-red-100 p-3">
                <DynamicIcon
                  name="XCircle"
                  className="h-12 w-12 text-red-500"
                />
              </div>
              <p className="mt-4 text-red-600 font-medium">{message}</p>
              <p className="mt-2 text-gray-600">
                Please check if you clicked the correct link or try resending
                the verification email.
              </p>

              <div className="mt-6 w-full max-w-xs">
                <form onSubmit={handleResendVerification} className="space-y-3">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={resending || !email}
                    className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:bg-gray-400"
                  >
                    {resending ? "Sending..." : "Resend Verification Email"}
                  </button>
                </form>
              </div>

              <Link
                href="/register"
                className="mt-4 text-primary hover:underline"
              >
                Back to Registration
              </Link>
            </div>
          )}

          {status === "resent" && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="rounded-full bg-green-100 p-3">
                <DynamicIcon name="Mail" className="h-12 w-12 text-green-500" />
              </div>
              <p className="mt-4 text-green-600 font-medium">{message}</p>
              <p className="mt-2 text-gray-600">
                Please check your email for the verification link.
              </p>
              <Link href="/login" className="mt-6 text-primary hover:underline">
                Back to Login
              </Link>
            </div>
          )}
        </ClientOnly>
      </div>
    </div>
  );
}
