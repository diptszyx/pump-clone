"use client";

import { CheckCircle, ExternalLink, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";

interface SwapToastProps {
  type: "success" | "error" | "loading";
  swapType: "buy" | "sell";
  tokenSymbol: string;
  transactionHash?: string;
  message?: string;
}

export function showSwapToast({
  type,
  swapType,
  tokenSymbol,
  transactionHash,
  message,
}: SwapToastProps) {
  const action = swapType === "buy" ? "Purchase" : "Sale";

  switch (type) {
    case "success":
      return toast.custom(
        (t) => (
          <div className="bg-[#1a1d2e] border border-green-500/30 rounded-xl p-4 shadow-lg max-w-md">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-white font-medium text-sm">
                    {action} Successful!
                  </h4>
                  <button
                    onClick={() => toast.dismiss(t)}
                    className="text-gray-400 hover:text-white text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
                <p className="text-gray-400 text-xs mb-2">
                  Your {swapType} of {tokenSymbol} has been confirmed
                </p>
                {transactionHash && (
                  <button
                    onClick={() =>
                      window.open(
                        `https://sepolia.etherscan.io/tx/${transactionHash}`,
                        "_blank"
                      )
                    }
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View on Etherscan
                  </button>
                )}
              </div>
            </div>
          </div>
        ),
        {
          duration: 5000,
        }
      );

    case "error":
      return toast.custom(
        (t) => (
          <div className="bg-[#1a1d2e] border border-red-500/30 rounded-xl p-4 shadow-lg max-w-md">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-white font-medium text-sm">
                    {action} Failed
                  </h4>
                  <button
                    onClick={() => toast.dismiss(t)}
                    className="text-gray-400 hover:text-white text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
                <p className="text-gray-400 text-xs">
                  {message ||
                    `Failed to ${swapType} ${tokenSymbol}. Please try again.`}
                </p>
              </div>
            </div>
          </div>
        ),
        {
          duration: 4000,
        }
      );

    case "loading":
      return toast.custom(
        (t) => (
          <div className="bg-[#1a1d2e] border border-blue-500/30 rounded-xl p-4 shadow-lg max-w-md">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-blue-400 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-white font-medium text-sm">
                    Processing {action}
                  </h4>
                  <button
                    onClick={() => toast.dismiss(t)}
                    className="text-gray-400 hover:text-white text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
                <p className="text-gray-400 text-xs">
                  {message ||
                    `Your ${swapType} transaction is being processed...`}
                </p>
              </div>
            </div>
          </div>
        ),
        {
          duration: Infinity, // Keep until manually dismissed
        }
      );

    default:
      return null;
  }
}

// Utility functions for common swap toasts
export const swapToasts = {
  success: (
    swapType: "buy" | "sell",
    tokenSymbol: string,
    transactionHash: string
  ) =>
    showSwapToast({ type: "success", swapType, tokenSymbol, transactionHash }),

  error: (swapType: "buy" | "sell", tokenSymbol: string, message?: string) =>
    showSwapToast({ type: "error", swapType, tokenSymbol, message }),

  loading: (swapType: "buy" | "sell", tokenSymbol: string, message?: string) =>
    showSwapToast({ type: "loading", swapType, tokenSymbol, message }),
};
