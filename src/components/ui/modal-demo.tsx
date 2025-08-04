"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
  SwapSuccessModal,
  SwapLoadingModal,
} from "@/src/components/ui/swap-success-modal";
import { swapToasts } from "@/src/components/ui/swap-toast";

export function ModalDemo() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [loadingStep, setLoadingStep] = useState<
    "preparing" | "confirming" | "processing"
  >("preparing");

  const demoSuccessData = {
    transactionHash: "0x1234567890abcdef1234567890abcdef12345678",
    swapType: "buy" as const,
    tokenSymbol: "MOON",
    amountIn: "0.1",
    amountOut: "1000000",
    tokenInSymbol: "ETH",
    tokenOutSymbol: "MOON",
  };

  const testLoadingFlow = async () => {
    setLoadingStep("preparing");
    setShowLoadingModal(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoadingStep("confirming");

    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoadingStep("processing");

    await new Promise((resolve) => setTimeout(resolve, 2000));
    setShowLoadingModal(false);
    setShowSuccessModal(true);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <div className="bg-[#1a1d2e] p-4 rounded-lg border border-gray-700 space-y-2">
        <h3 className="text-white text-sm font-medium">Modal Demo</h3>

        <Button
          onClick={() => setShowSuccessModal(true)}
          size="sm"
          className="w-full bg-green-600 hover:bg-green-700"
        >
          Test Success Modal
        </Button>

        <Button
          onClick={testLoadingFlow}
          size="sm"
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Test Loading Flow
        </Button>

        <Button
          onClick={() => swapToasts.success("buy", "MOON", "0x123...456")}
          size="sm"
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          Test Success Toast
        </Button>

        <Button
          onClick={() => swapToasts.error("sell", "MOON", "Transaction failed")}
          size="sm"
          className="w-full bg-red-600 hover:bg-red-700"
        >
          Test Error Toast
        </Button>
      </div>

      <SwapSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        {...demoSuccessData}
      />

      <SwapLoadingModal
        isOpen={showLoadingModal}
        swapType="buy"
        tokenSymbol="MOON"
        step={loadingStep}
      />
    </div>
  );
}
