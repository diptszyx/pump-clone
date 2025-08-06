"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/src/components/ui/8bit/button";
import {
  useBuyToken,
  useSellToken,
  useTokenQuote,
  useTokenBalance,
} from "@/src/hooks/useTokenActions";
import { useAccount } from "wagmi";
import { tokenUtils } from "@/src/utils/token";
import { WETH_ADDRESS } from "@/src/constants/contracts";
import { toast } from "sonner";
import { publicClient } from "@/src/lib/viem";
import {
  SwapSuccessModal,
  SwapLoadingModal,
} from "@/src/components/ui/swap-success-modal";
import { swapToasts } from "@/src/components/ui/swap-toast";
import { getTokenPriceUsd, getEthPriceUsd } from "@/src/utils/tokenPrice";
import { Token } from "@/src/types/token";
import { saveTransaction } from "@/src/utils/saveTransaction";
import { getEightBitInputStyle } from "@/src/styles/8bit-styles";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

export default function TradeBox({ token }: { token: Token }) {
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<"buy" | "sell">("buy");
  const [quoteResult, setQuoteResult] = useState<bigint>(0n);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loadingStep, setLoadingStep] = useState<
    "preparing" | "confirming" | "processing"
  >("preparing");
  const [transactionHash, setTransactionHash] = useState("");
  const [swapResult, setSwapResult] = useState({
    amountIn: "",
    amountOut: "",
    tokenInSymbol: "",
    tokenOutSymbol: "",
  });

  const debouncedAmount = useDebounce(amount, 1000);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { address } = useAccount();
  const { buyToken } = useBuyToken();
  const { sellToken } = useSellToken();
  const { getQuote } = useTokenQuote();
  const {
    tokenDecimals,
    isLoading: isBalanceLoading,
    getMaxBuyAmount,
    getMaxSellAmount,
    formatTokenBalance,
    formatEthBalance,
  } = useTokenBalance(token.address as `0x${string}`);

  const tokenSymbol = token.metadata?.symbol || "TOKEN";

  useEffect(() => {
    if (!debouncedAmount || Number(debouncedAmount) <= 0) {
      setQuoteResult(0n);
      return;
    }

    (async () => {
      setIsQuoteLoading(true);
      try {
        const tokenIn =
          mode === "buy" ? WETH_ADDRESS : (token.address as `0x${string}`);
        const tokenOut =
          mode === "buy" ? (token.address as `0x${string}`) : WETH_ADDRESS;

        const res = await getQuote(tokenIn, tokenOut, debouncedAmount);
        setQuoteResult(res);
      } catch (err) {
        console.error("Quote failed:", err);
        setQuoteResult(0n);
        toast.error("Failed to fetch quote");
      } finally {
        setIsQuoteLoading(false);
      }
    })();
  }, [debouncedAmount, mode, token.address, getQuote]);

  const expectedOutput = useMemo(
    () => tokenUtils.weiToEth(quoteResult),
    [quoteResult]
  );

  const isAmountExceedsLimit = useMemo(() => {
    if (!amount || Number(amount) <= 0) return false;

    if (mode === "buy") {
      const amountWei = tokenUtils.ethToWei(amount);
      const maxBuyAmount = getMaxBuyAmount();
      return amountWei > maxBuyAmount;
    } else {
      const amountWei = tokenUtils.tokenToWei(amount, tokenDecimals);
      const maxSellAmount = getMaxSellAmount();
      return amountWei > maxSellAmount;
    }
  }, [amount, mode, getMaxBuyAmount, getMaxSellAmount, tokenDecimals]);

  const limitErrorMessage = useMemo(() => {
    if (!isAmountExceedsLimit) return null;

    if (mode === "buy") {
      const maxBuyAmount = getMaxBuyAmount();
      const gasBuffer = tokenUtils.ethToWei("0.01");
      const safeMaxAmount =
        maxBuyAmount > gasBuffer ? maxBuyAmount - gasBuffer : 0n;
      return `Maximum buy amount: ${Number(tokenUtils.weiToEth(safeMaxAmount)).toFixed(4)} ETH`;
    } else {
      const maxSellAmount = getMaxSellAmount();
      return `Maximum sell amount: ${tokenUtils.formatTokenAmount(maxSellAmount, tokenDecimals, 2)} ${tokenSymbol}`;
    }
  }, [
    isAmountExceedsLimit,
    mode,
    getMaxBuyAmount,
    getMaxSellAmount,
    tokenSymbol,
    tokenDecimals,
  ]);

  const handleTrade = async () => {
    if (!amount || !address) {
      toast.error("Please connect wallet and enter amount");
      return;
    }

    if (isAmountExceedsLimit) {
      toast.error(limitErrorMessage || "Amount exceeds limit");
      return;
    }

    try {
      setLoadingStep("preparing");
      setShowLoadingModal(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setLoadingStep("confirming");

      const hash =
        mode === "buy"
          ? await buyToken(token.address as `0x${string}`, amount)
          : await sellToken(token.address as `0x${string}`, amount);

      setLoadingStep("processing");

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      if (receipt.status === "success") {
        setShowLoadingModal(false);

        const ethPrice = await getEthPriceUsd();
        const tokenPrice = await getTokenPriceUsd(token.address);

        if (!ethPrice) {
          console.warn(" Failed to fetch ETH price, assigning value 4000");
        }
        if (!tokenPrice) {
          console.warn("Failed to fetch token price, assigning value 0.000006");
        }

        const valueUsd =
          mode === "buy"
            ? Number(amount) * ethPrice
            : Number(amount) * tokenPrice;

        await saveTransaction({
          tokenAddress: token.address,
          userAddress: address,
          type: mode.toUpperCase(),
          amount: Number(amount),
          valueUsd,
          txHash: hash,
        });

        setTransactionHash(hash);
        setSwapResult({
          amountIn: amount,
          amountOut: Number(expectedOutput).toFixed(mode === "buy" ? 2 : 6),
          tokenInSymbol: mode === "buy" ? "ETH" : tokenSymbol,
          tokenOutSymbol: mode === "buy" ? tokenSymbol : "ETH",
        });

        setShowSuccessModal(true);

        setAmount("");

        swapToasts.success(mode, tokenSymbol, hash);
      } else {
        setShowLoadingModal(false);
        swapToasts.error(mode, tokenSymbol, "Transaction failed");
      }
    } catch (error) {
      console.error("Trade failed:", error);
      setShowLoadingModal(false);

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      if (errorMessage.includes("User rejected")) {
        swapToasts.error(mode, tokenSymbol, "Transaction cancelled by user");
      } else if (errorMessage.includes("insufficient funds")) {
        swapToasts.error(
          mode,
          tokenSymbol,
          "Insufficient funds for transaction"
        );
      } else {
        swapToasts.error(mode, tokenSymbol);
      }
    }
  };

  return (
    <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800/50 shadow-lg">
      <div className="flex items-center gap-3 mb-6 p-4 bg-[#0f111a] rounded-xl">
        <div className="relative flex-shrink-0">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-green-500/50 shadow-lg hover:border-green-400/70 transition-all duration-300 hover:shadow-green-500/20 hover:shadow-xl">
            <Image
              src={token.metadata?.image || "/placeholder.png"}
              alt={token.metadata?.name || "Token"}
              fill
              className="object-cover"
              sizes="48px"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent pointer-events-none"></div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white truncate">
            {token.metadata?.name || "Unknown Token"}
          </h3>
          <p className="text-sm text-gray-400 font-medium">
            ${token.metadata?.symbol || "TOKEN"}
          </p>
        </div>
      </div>

      <div className="flex mb-6 bg-[#0f111a] rounded-xl p-1 ">
        <button
          className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all ${
            mode === "buy"
              ? "bg-green-500 text-white shadow-lg"
              : "text-gray-400 hover:text-white hover:bg-gray-700/50"
          }`}
          onClick={() => setMode("buy")}
        >
          🟢 Buy
        </button>
        <button
          className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all ${
            mode === "sell"
              ? "bg-red-500 text-white shadow-lg"
              : "text-gray-400 hover:text-white hover:bg-gray-700/50"
          }`}
          onClick={() => setMode("sell")}
        >
          🔴 Sell
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-300">
            {mode === "buy" ? "Pay with ETH" : `Pay with ${tokenSymbol}`}
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              Balance:{" "}
              {isBalanceLoading
                ? "Loading..."
                : mode === "buy"
                  ? `${formatEthBalance()} ETH`
                  : `${formatTokenBalance()} ${tokenSymbol}`}
            </span>
            <button
              onClick={() => {
                if (mode === "buy") {
                  const maxAmount = getMaxBuyAmount();
                  const gasBuffer = tokenUtils.ethToWei("0.01");
                  const safeMaxAmount =
                    maxAmount > gasBuffer ? maxAmount - gasBuffer : 0n;
                  setAmount(tokenUtils.weiToEth(safeMaxAmount));
                } else {
                  const maxAmount = getMaxSellAmount();

                  const bufferPercent = 1000n;
                  const bufferAmount = maxAmount / bufferPercent;
                  const safeMaxAmount =
                    maxAmount > bufferAmount ? maxAmount - bufferAmount : 0n;
                  setAmount(
                    tokenUtils.weiToToken(safeMaxAmount, tokenDecimals)
                  );
                }
              }}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
              disabled={isBalanceLoading}
            >
              Max
            </button>
          </div>
        </div>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            style={{
              ...getEightBitInputStyle(isInputFocused),
              ...(isAmountExceedsLimit && {
                boxShadow: `
                  2px 0 #ef4444,
                  -2px 0 #ef4444,
                  0 -2px #ef4444,
                  0 2px #ef4444,
                  4px 0 #ef4444,
                  -4px 0 #ef4444,
                  0 -4px #ef4444,
                  0 4px #ef4444,
                  0 0 0 2px #ef4444
                `,
              }),
            }}
            className="w-full p-4 pr-20 text-white text-lg font-medium transition-all"
            placeholder="0.0"
            step="0.01"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="flex items-center gap-2">
              {mode === "sell" && (
                <div className="relative w-5 h-5 rounded-full overflow-hidden border border-gray-600 flex-shrink-0">
                  <Image
                    src={token.metadata?.image || "/placeholder.png"}
                    alt={token.metadata?.name || "Token"}
                    fill
                    className="object-cover"
                    sizes="20px"
                  />
                </div>
              )}
              <span className="text-gray-400 text-sm font-medium">
                {mode === "buy" ? "ETH" : tokenSymbol}
              </span>
            </div>
          </div>
        </div>
        {isAmountExceedsLimit && limitErrorMessage && (
          <div className="mt-2 text-red-400 text-xs">{limitErrorMessage}</div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-300">
            {mode === "buy" ? `Receive ${tokenSymbol}` : "Receive ETH"}
          </label>
        </div>
        <div className="relative">
          <div
            className="w-full p-4 pr-20 text-white text-lg font-medium"
            style={getEightBitInputStyle(false)}
          >
            {isQuoteLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-400">Loading...</span>
              </div>
            ) : (
              <span className={amount ? "text-white" : "text-gray-500"}>
                {amount
                  ? Number(expectedOutput).toFixed(mode === "buy" ? 2 : 6)
                  : "0.0"}
              </span>
            )}
          </div>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="flex items-center gap-2">
              {mode === "buy" && (
                <div className="relative w-5 h-5 rounded-full overflow-hidden border border-gray-600 flex-shrink-0">
                  <Image
                    src={token.metadata?.image || "/placeholder.png"}
                    alt={token.metadata?.name || "Token"}
                    fill
                    className="object-cover"
                    sizes="20px"
                  />
                </div>
              )}
              <span className="text-gray-400 text-sm font-medium">
                {mode === "buy" ? tokenSymbol : "ETH"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={handleTrade}
        disabled={
          !isMounted ||
          !amount ||
          !address ||
          isQuoteLoading ||
          isAmountExceedsLimit
        }
        className={`w-full py-4 rounded-xl text-white font-semibold text-xs transition-all shadow-lg ${
          mode === "buy"
            ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700"
            : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700"
        } disabled:cursor-not-allowed`}
      >
        {!isMounted
          ? "Loading..."
          : !address
            ? "Connect Wallet"
            : !amount
              ? "Enter Amount"
              : isAmountExceedsLimit
                ? "Amount Exceeds Limit"
                : isQuoteLoading
                  ? "Loading..."
                  : `${mode === "buy" ? "Buy" : "Sell"} ${tokenSymbol}`}
      </Button>

      <SwapLoadingModal
        isOpen={showLoadingModal}
        swapType={mode}
        tokenSymbol={tokenSymbol}
        step={loadingStep}
      />

      <SwapSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        transactionHash={transactionHash}
        swapType={mode}
        tokenSymbol={tokenSymbol}
        amountIn={swapResult.amountIn}
        amountOut={swapResult.amountOut}
        tokenInSymbol={swapResult.tokenInSymbol}
        tokenOutSymbol={swapResult.tokenOutSymbol}
      />
    </div>
  );
}
