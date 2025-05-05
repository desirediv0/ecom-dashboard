"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { ClientOnly } from "@/components/client-only";
import { DynamicIcon } from "@/components/dynamic-icon";

export default function VerifyEmailPage({ params }) {
  const { token } = params;
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await verifyEmail(token);
        setStatus("success");
        setMessage(response.message || "Email verified successfully");
      } catch (error) {
        setStatus("error");
        setMessage(
          error.message ||
            "Unable to verify email. The token may be invalid or expired."
        );
      }
    };

    if (token) {
      verify();
    }
  }, [token, verifyEmail]);

  return (
    <div className="container max-w-lg mx-auto p-8">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>

        <ClientOnly fallback={<div className="py-8">Loading...</div>}>
          {status === "verifying" && (
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
                Please check if you clicked the correct link or try registering
                again.
              </p>
              <Link
                href="/register"
                className="mt-6 inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Back to Registration{" "}
                <DynamicIcon name="ArrowRight" className="ml-2 h-4 w-4" />
              </Link>
            </div>
          )}
        </ClientOnly>
      </div>
    </div>
  );
}
