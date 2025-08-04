"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
  showHomeLink?: boolean;
}

export function ErrorBoundary({
  error,
  reset,
  title = "Đã xảy ra lỗi",
  description = "Xin lỗi, đã có sự cố xảy ra khi tải trang.",
  showHomeLink = true,
}: ErrorBoundaryProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center bg-black">
      <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
      <p className="mb-8 text-gray-300">{description}</p>
      <div className="flex gap-4">
        <button
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg"
          onClick={reset}
        >
          Thử lại
        </button>
        {showHomeLink && (
          <Link
            href="/"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg"
          >
            Về trang chủ
          </Link>
        )}
      </div>
    </div>
  );
}
