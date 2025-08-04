"use client";

import { useState, useEffect } from "react";
import { X, ExternalLink, CheckCircle, Copy, ArrowUpRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/src/lib/utils";

interface SwapSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionHash: string;
  swapType: "buy" | "sell";
  tokenSymbol: string;
  amountIn: string;
  amountOut: string;
  tokenInSymbol: string;
  tokenOutSymbol: string;
}

export function SwapSuccessModal({
  isOpen,
  onClose,
  transactionHash,
  swapType,
  amountIn,
  amountOut,
  tokenInSymbol,
  tokenOutSymbol,
}: SwapSuccessModalProps) {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Transaction hash copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const etherscanUrl = `https://sepolia.etherscan.io/tx/${transactionHash}`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "relative bg-[#1a1d2e] rounded-2xl p-8 mx-4 max-w-md w-full border border-gray-800/50 shadow-2xl transition-all duration-200",
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center success-bounce">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {swapType === "buy" ? "Purchase" : "Sale"} Successful!
          </h2>
          <p className="text-gray-400">
            Your {swapType} transaction has been confirmed
          </p>
        </div>

        {/* Transaction Details */}
        <div className="space-y-4 mb-6">
          {/* Swap Summary */}
          <div className="bg-[#0f111a] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">
                You {swapType === "buy" ? "paid" : "sold"}
              </span>
              <span className="text-white font-medium">
                {amountIn} {tokenInSymbol}
              </span>
            </div>

            <div className="flex items-center justify-center my-2">
              <ArrowUpRight className="w-4 h-4 text-gray-500 transform rotate-90" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">
                You {swapType === "buy" ? "received" : "got"}
              </span>
              <span className="text-white font-medium">
                {amountOut} {tokenOutSymbol}
              </span>
            </div>
          </div>

          {/* Transaction Hash */}
          <div className="bg-[#0f111a] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Transaction Hash</span>
              <button
                onClick={() => copyToClipboard(transactionHash)}
                className="p-1 hover:bg-gray-700/50 rounded transition-colors"
                title="Copy hash"
              >
                <Copy
                  className={`w-4 h-4 ${copied ? "text-green-400" : "text-gray-400"}`}
                />
              </button>
            </div>
            <div className="text-white text-sm font-mono break-all">
              {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleClose}
            variant="outline"
            className="flex-1 bg-gray-700/50 hover:bg-gray-600/50 border-gray-600 text-white"
          >
            Close
          </Button>
          <Button
            onClick={() => window.open(etherscanUrl, "_blank")}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Etherscan
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Transaction confirmed on Sepolia testnet
          </p>
        </div>
      </div>
    </div>
  );
}

interface SwapLoadingModalProps {
  isOpen: boolean;
  swapType: "buy" | "sell";
  tokenSymbol: string;
  step: "preparing" | "confirming" | "processing";
}

export function SwapLoadingModal({
  isOpen,
  swapType,
  tokenSymbol,
  step,
}: SwapLoadingModalProps) {
  const getStepInfo = () => {
    switch (step) {
      case "preparing":
        return {
          title: "Preparing Transaction",
          description: "Setting up your swap parameters...",
          progress: 33,
        };
      case "confirming":
        return {
          title: "Confirm in Wallet",
          description: "Please confirm the transaction in your wallet",
          progress: 66,
        };
      case "processing":
        return {
          title: "Processing Swap",
          description: "Your transaction is being processed on the blockchain",
          progress: 100,
        };
      default:
        return {
          title: "Processing",
          description: "Please wait...",
          progress: 0,
        };
    }
  };

  const stepInfo = getStepInfo();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-[#1a1d2e] rounded-2xl p-8 mx-4 max-w-sm w-full border border-gray-800/50 shadow-2xl">
        {/* Loading Animation */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="w-16 h-16 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full animate-pulse"></div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-2">
            {stepInfo.title}
          </h2>
          <p className="text-gray-400 text-sm mb-4">{stepInfo.description}</p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${stepInfo.progress}%` }}
            />
          </div>

          <div className="text-sm text-gray-500">
            {swapType === "buy" ? "Buying" : "Selling"} {tokenSymbol}
          </div>
        </div>

        {/* Steps Indicator */}
        <div className="flex justify-between text-xs text-gray-500 mb-4">
          <span
            className={
              step === "preparing"
                ? "text-blue-400"
                : step === "confirming" || step === "processing"
                  ? "text-green-400"
                  : ""
            }
          >
            Prepare
          </span>
          <span
            className={
              step === "confirming"
                ? "text-blue-400"
                : step === "processing"
                  ? "text-green-400"
                  : ""
            }
          >
            Confirm
          </span>
          <span className={step === "processing" ? "text-blue-400" : ""}>
            Process
          </span>
        </div>

        <div className="text-center text-xs text-gray-600">
          Do not close this window or refresh the page
        </div>
      </div>
    </div>
  );
}
