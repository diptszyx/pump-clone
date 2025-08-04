import {
  useWriteTokenFactoryCreateTokenAndPool,
  useWriteTokenTraderBuyToken,
  useWriteTokenTraderSellToken,
  useWriteTokenFactoryCollectFees,
} from "@/src/generated";
import { tokenUtils } from "@/src/utils/token";
import { generatePermitSignature } from "@/src/utils/permit";
import {
  TOKEN_FACTORY_ADDRESS,
  TOKEN_TRADER_ADDRESS,
  WETH_ADDRESS,
} from "@/src/constants/contracts";
import { publicClient } from "@/src/lib/viem";
import TokenTraderABI from "@/src/abi/TokenTrader.json";
import TokenFactoryABI from "@/src/abi/TokenFactory.json";
import { useAccount, useWalletClient, useBalance } from "wagmi";
import {
  parseEther,
  WalletClient,
  PublicClient,
  decodeEventLog,
  Log,
} from "viem";
import { useState, useEffect } from "react";

interface FeesCollectedArgs {
  token: `0x${string}`;
  creator: `0x${string}`;
  ethFees: bigint;
  tokenFees: bigint;
}

export function useCreateToken() {
  const { writeContract } = useWriteTokenFactoryCreateTokenAndPool();

  const createToken = async (
    name: string,
    symbol: string,
    tokenURI: string,
    ethAmount: string
  ) => {
    const weiAmount = tokenUtils.ethToWei(ethAmount);

    return writeContract({
      address: TOKEN_FACTORY_ADDRESS,
      args: [name, symbol, tokenURI],
      value: weiAmount,
    });
  };

  return { createToken };
}

export function useBuyToken() {
  const { writeContractAsync } = useWriteTokenTraderBuyToken();

  const buyToken = async (
    tokenAddress: `0x${string}`,
    ethAmount: string,
    slippagePercent: number = 5
  ) => {
    const weiAmount = tokenUtils.ethToWei(ethAmount);
    const slippageBps = tokenUtils.percentToBps(slippagePercent);

    return await writeContractAsync({
      address: TOKEN_TRADER_ADDRESS,
      args: [tokenAddress, slippageBps],
      value: weiAmount,
    });
  };

  return { buyToken };
}

export function useSellToken() {
  const { writeContractAsync } = useWriteTokenTraderSellToken();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const sellToken = async (
    tokenAddress: `0x${string}`,
    tokenAmount: string,
    tokenDecimals: number = 18,
    slippagePercent: number = 5
  ) => {
    if (!address || !walletClient) {
      throw new Error("Wallet not connected");
    }

    const amountWei = tokenUtils.tokenToWei(tokenAmount, tokenDecimals);
    const slippageBps = tokenUtils.percentToBps(slippagePercent);

    const permitSignature = await generatePermitSignature(
      tokenAddress,
      TOKEN_TRADER_ADDRESS,
      amountWei,
      address,
      walletClient as WalletClient,
      publicClient as PublicClient
    );

    return await writeContractAsync({
      address: TOKEN_TRADER_ADDRESS,
      args: [
        tokenAddress,
        amountWei,
        slippageBps,
        BigInt(permitSignature.deadline),
        permitSignature.v,
        permitSignature.r,
        permitSignature.s,
      ],
      value: parseEther("0.000125"),
    });
  };

  return { sellToken };
}

export function useTokenQuote() {
  const getQuote = async (
    tokenIn: `0x${string}`,
    tokenOut: `0x${string}`,
    amountIn: string
  ): Promise<bigint> => {
    const amountWei = tokenUtils.ethToWei(amountIn);

    const res = await publicClient.readContract({
      address: TOKEN_TRADER_ADDRESS,
      abi: TokenTraderABI.abi,
      functionName: "getAmountOut",
      args: [tokenIn, tokenOut, amountWei],
    });

    return res as bigint;
  };

  return { getQuote };
}

export function useCollectFees() {
  const { writeContractAsync } = useWriteTokenFactoryCollectFees();
  const { data: walletClient } = useWalletClient();
  const simulateTransaction = async (tokenAddress: `0x${string}`) => {
    try {
      const account = walletClient?.account?.address;
      const result = await publicClient.simulateContract({
        address: TOKEN_FACTORY_ADDRESS,
        abi: TokenFactoryABI.abi,
        functionName: "collectFees",
        args: [tokenAddress],
        account,
      });
      return { success: true, data: result };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { success: false, error };
      }
      return { success: false, error: new Error("Unknown error occurred") };
    }
  };

  const collectFees = async (address: `0x${string}`) => {
    const hash = await writeContractAsync({
      address: TOKEN_FACTORY_ADDRESS,
      args: [address],
    });

    return hash;
  };

  return {
    collectFees,
    simulateTransaction,
  };
}

export function getFeesCollectedFromReceipt(receipt: { logs: Log[] }) {
  let feesEvent: FeesCollectedArgs | null = null;

  for (const log of receipt.logs) {
    try {
      const decoded = decodeEventLog({
        abi: TokenFactoryABI.abi,
        data: log.data,
        topics: log.topics,
      });

      if (decoded.eventName === "FeesCollected" && decoded.args) {
        const { token, creator, ethFees, tokenFees } =
          decoded.args as unknown as {
            token: `0x${string}`;
            creator: `0x${string}`;
            ethFees: bigint;
            tokenFees: bigint;
          };

        feesEvent = { token, creator, ethFees, tokenFees };
        break;
      }
    } catch (err) {
      console.error("Failed to decode event log:", err);
    }
  }

  if (!feesEvent) {
    throw new Error("No FeesCollected event found in receipt");
  }

  return feesEvent;
}

export function useTokenBalance(tokenAddress?: `0x${string}`) {
  const { address } = useAccount();
  const [tokenBalance, setTokenBalance] = useState<bigint>(0n);
  const [ethBalance, setEthBalance] = useState<bigint>(0n);
  const [maxSwapAmount, setMaxSwapAmount] = useState<bigint>(0n);
  const [tokenDecimals, setTokenDecimals] = useState<number>(18);
  const [isLoading, setIsLoading] = useState(false);

  const { data: ethBalanceData } = useBalance({
    address: address as `0x${string}` | undefined,
  });

  useEffect(() => {
    if (ethBalanceData?.value) {
      setEthBalance(ethBalanceData.value);
    }
  }, [ethBalanceData]);

  useEffect(() => {
    if (!address || !tokenAddress) {
      setTokenBalance(0n);
      setMaxSwapAmount(0n);
      return;
    }

    const fetchBalances = async () => {
      setIsLoading(true);
      try {
        const [decimals, balance] = await Promise.all([
          publicClient.readContract({
            address: tokenAddress,
            abi: [
              {
                name: "decimals",
                type: "function",
                stateMutability: "view",
                inputs: [],
                outputs: [{ name: "", type: "uint8" }],
              },
            ],
            functionName: "decimals",
          }),
          publicClient.readContract({
            address: tokenAddress,
            abi: [
              {
                name: "balanceOf",
                type: "function",
                stateMutability: "view",
                inputs: [{ name: "account", type: "address" }],
                outputs: [{ name: "", type: "uint256" }],
              },
            ],
            functionName: "balanceOf",
            args: [address],
          }),
        ]);

        setTokenDecimals(decimals as number);
        setTokenBalance(balance as bigint);

        try {
          const testAmount = tokenUtils.ethToWei("1000");
          await publicClient.readContract({
            address: TOKEN_TRADER_ADDRESS,
            abi: TokenTraderABI.abi,
            functionName: "getAmountOut",
            args: [WETH_ADDRESS, tokenAddress, testAmount],
          });
          setMaxSwapAmount(testAmount);
        } catch {
          try {
            const testAmount = tokenUtils.ethToWei("100");
            await publicClient.readContract({
              address: TOKEN_TRADER_ADDRESS,
              abi: TokenTraderABI.abi,
              functionName: "getAmountOut",
              args: [WETH_ADDRESS, tokenAddress, testAmount],
            });
            setMaxSwapAmount(testAmount);
          } catch {
            try {
              const testAmount = tokenUtils.ethToWei("10");
              await publicClient.readContract({
                address: TOKEN_TRADER_ADDRESS,
                abi: TokenTraderABI.abi,
                functionName: "getAmountOut",
                args: [WETH_ADDRESS, tokenAddress, testAmount],
              });
              setMaxSwapAmount(testAmount);
            } catch {
              setMaxSwapAmount(tokenUtils.ethToWei("1"));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching balances:", error);
        setTokenBalance(0n);
        setMaxSwapAmount(0n);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalances();
  }, [address, tokenAddress]);

  return {
    tokenBalance,
    ethBalance,
    maxSwapAmount,
    tokenDecimals,
    isLoading,

    getMaxBuyAmount: () => {
      return ethBalance < maxSwapAmount ? ethBalance : maxSwapAmount;
    },
    getMaxSellAmount: () => {
      return tokenBalance;
    },
    formatTokenBalance: (displayDecimals: number = 2) => {
      return tokenUtils.formatTokenAmount(
        tokenBalance,
        tokenDecimals,
        displayDecimals
      );
    },
    formatEthBalance: (displayDecimals: number = 4) => {
      return tokenUtils.formatTokenAmount(ethBalance, 18, displayDecimals);
    },
  };
}
