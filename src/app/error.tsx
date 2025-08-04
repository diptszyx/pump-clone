"use client";

import { useEffect } from "react";
import { ErrorBoundary } from "@/src/components/ErrorBoundary";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error chi tiết hơn để dễ debug
    console.error("Client side error details:", {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
    });
  }, [error]);

  return <ErrorBoundary error={error} reset={reset} />;
}
