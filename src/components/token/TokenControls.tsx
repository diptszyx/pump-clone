"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/8bit/button";
import { Input } from "@/src/components/ui/input";
import { cn } from "@/src/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  useCollectFees,
  getFeesCollectedFromReceipt,
} from "@/src/hooks/useTokenActions";
import { useWaitForTransactionReceipt } from "wagmi";
import { toast } from "sonner";
import { getEthPriceUsd, getTokenPriceUsd } from "@/src/utils/tokenPrice";
import { saveTransaction } from "@/src/utils/saveTransaction";
import { publicClient } from "@/src/lib/viem";

export function TokenControls() {
  const [isCollectFeesOpen, setIsCollectFeesOpen] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const { collectFees, simulateTransaction } = useCollectFees();

  const {
    isLoading: isConfirming,
    isSuccess,
    isError,
    error: txError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isSuccess && txHash) {
      toast.success("Fees collected successfully!");
      (async () => {
        const receipt = await publicClient.getTransactionReceipt({
          hash: txHash,
        });
        const fees = getFeesCollectedFromReceipt(receipt);

        const ethPrice = await getEthPriceUsd();
        const tokenPrice = await getTokenPriceUsd(fees.token);

        const valueUsd =
          (Number(fees.ethFees) / 1e18) * ethPrice +
          (Number(fees.tokenFees) / 1e18) * tokenPrice;

        saveTransaction({
          tokenAddress: fees.token,
          userAddress: fees.creator,
          type: "REWARD",
          amount: 0,
          valueUsd: valueUsd,
          txHash,
        });
      })();
      setIsCollectFeesOpen(false);
      setTokenAddress("");
      setTxHash(undefined);
      setIsLoading(false);
    }
  }, [isSuccess, txHash]);

  useEffect(() => {
    if (isError && txError) {
      toast.error(`Transaction failed: ${txError.message}`);
      console.log(txError.message);
      setTxHash(undefined);
      setIsLoading(false);
    }
  }, [isError, txError]);

  const handleCollectFees = async () => {
    if (!tokenAddress) {
      toast.error("Please enter token address");
      return;
    }

    if (!tokenAddress.startsWith("0x") || tokenAddress.length !== 42) {
      toast.error("Invalid token address format");
      return;
    }

    try {
      setIsSimulating(true);

      const simulation = await simulateTransaction(
        tokenAddress as `0x${string}`
      );

      if (!simulation.success) {
        const errorMessage = simulation.error?.message?.includes("nonexistent")
          ? "Token not found - please check the address"
          : simulation.error?.message || "Transaction will fail";
        toast.error(errorMessage);
        setIsSimulating(false);
        return;
      }

      setIsSimulating(false);
      setIsLoading(true);

      const hash = await collectFees(tokenAddress as `0x${string}`);

      setTxHash(hash);

      toast.info("Transaction sent! Waiting for confirmation...");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Collect fees error:", error);
        toast.error(error.message || "Failed to send transaction");
      } else {
        console.error("Collect fees error:", error);
        toast.error("Failed to send transaction");
      }
      setIsLoading(false);
      setIsSimulating(false);
    }
  };

  const isProcessing = isLoading || isConfirming || isSimulating;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-center gap-4 mb-6 ">
        <Button
          size="lg"
          variant="neon"
          font="retro"
          onClick={() => setIsCollectFeesOpen(true)}
          className={cn(
            "px-6 py-3 text-sm font-medium shadow-lg",
            "mt-10",
            "hover:shadow-xl transition-all duration-300",
            "bg-emerald-600 text-white hover:bg-emerald-500",
            "dark:bg-emerald-700 dark:hover:bg-emerald-600"
          )}
        >
          Collect Fees
        </Button>
      </div>

      <Dialog open={isCollectFeesOpen} onOpenChange={setIsCollectFeesOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Collect Token Fees</DialogTitle>
            <DialogDescription>
              Enter the token address to collect fees from the liquidity pool.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Token Address</label>
              <Input
                placeholder="0x..."
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                className="bg-gray-900 border-gray-700"
                disabled={isProcessing}
              />
            </div>

            {txHash && (
              <div className="text-sm text-gray-400 border-t border-gray-700 pt-3">
                <div className="flex items-center gap-2">
                  <span>Transaction:</span>
                  <code className="bg-gray-800 px-2 py-1 rounded text-xs">
                    {txHash.slice(0, 10)}...{txHash.slice(-8)}
                  </code>
                  {isConfirming && (
                    <div className="flex items-center gap-1 text-yellow-400">
                      <div className="w-3 h-3 border border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>Confirming...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                if (!isProcessing) {
                  setIsCollectFeesOpen(false);
                  setTokenAddress("");
                  setTxHash(undefined);
                }
              }}
              disabled={isProcessing}
              className={cn(
                "px-6 py-3 text-sm font-medium shadow-lg",
                "hover:shadow-xl transition-all duration-300",
                "bg-emerald-600 text-white hover:bg-emerald-500",
                "dark:bg-emerald-700 dark:hover:bg-emerald-600"
              )}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCollectFees}
              disabled={isProcessing || !tokenAddress}
              className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 disabled:opacity-50"
            >
              {isSimulating
                ? "Validating..."
                : isLoading
                  ? "Sending..."
                  : isConfirming
                    ? "Confirming..."
                    : "Collect Fees"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
