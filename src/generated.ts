import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from "wagmi/codegen";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TokenFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const tokenFactoryAbi = [
  {
    type: "constructor",
    inputs: [
      { name: "_uniswapFactory", internalType: "address", type: "address" },
      { name: "_positionManager", internalType: "address", type: "address" },
      { name: "_weth", internalType: "address", type: "address" },
      { name: "_swapRouter", internalType: "address", type: "address" },
    ],
    stateMutability: "nonpayable",
  },
  { type: "receive", stateMutability: "payable" },
  {
    type: "function",
    inputs: [],
    name: "POOL_FEE",
    outputs: [{ name: "", internalType: "uint24", type: "uint24" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "TOTAL_SUPPLY",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "WETH",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "tokenAddress", internalType: "address", type: "address" },
    ],
    name: "collectFees",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "name", internalType: "string", type: "string" },
      { name: "symbol", internalType: "string", type: "string" },
      { name: "tokenURI", internalType: "string", type: "string" },
    ],
    name: "createTokenAndPool",
    outputs: [
      { name: "tokenAddress", internalType: "address", type: "address" },
      { name: "poolAddress", internalType: "address", type: "address" },
    ],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [{ name: "ethAmount", internalType: "uint256", type: "uint256" }],
    name: "getPenalty",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [{ name: "", internalType: "address", type: "address" }],
    name: "launches",
    outputs: [
      { name: "creator", internalType: "address", type: "address" },
      { name: "positionId", internalType: "uint256", type: "uint256" },
      {
        name: "totalEthFeesCollected",
        internalType: "uint256",
        type: "uint256",
      },
      {
        name: "totalTokenFeesCollected",
        internalType: "uint256",
        type: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "owner",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "positionManager",
    outputs: [
      {
        name: "",
        internalType: "contract INonfungiblePositionManager",
        type: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "swapRouter",
    outputs: [
      { name: "", internalType: "contract ISwapRouter02", type: "address" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "uniswapFactory",
    outputs: [
      { name: "", internalType: "contract IUniswapV3Factory", type: "address" },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "token",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "creator",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "ethFees",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "tokenFees",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "FeesCollected",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "user", internalType: "address", type: "address", indexed: true },
      {
        name: "penaltyAmount",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "PenaltyApplied",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "token",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "creator",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      { name: "name", internalType: "string", type: "string", indexed: false },
      {
        name: "symbol",
        internalType: "string",
        type: "string",
        indexed: false,
      },
      { name: "pool", internalType: "address", type: "address", indexed: true },
      {
        name: "positionId",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "TokenCreated",
  },
  { type: "error", inputs: [], name: "ReentrancyGuardReentrantCall" },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TokenTrader
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const tokenTraderAbi = [
  {
    type: "constructor",
    inputs: [
      { name: "_swapRouter", internalType: "address", type: "address" },
      { name: "_quoter", internalType: "address", type: "address" },
      { name: "_tokenFactory", internalType: "address", type: "address" },
      { name: "_weth", internalType: "address", type: "address" },
    ],
    stateMutability: "nonpayable",
  },
  { type: "receive", stateMutability: "payable" },
  {
    type: "function",
    inputs: [],
    name: "BPS_DENOMINATOR",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "MAX_SLIPPAGE",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "POOL_FEE",
    outputs: [{ name: "", internalType: "uint24", type: "uint24" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "TRADING_FEE",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "WETH",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "tokenAddress", internalType: "address", type: "address" },
      { name: "slippageBps", internalType: "uint256", type: "uint256" },
    ],
    name: "buyToken",
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [],
    name: "feeRecipient",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "tokenIn", internalType: "address", type: "address" },
      { name: "tokenOut", internalType: "address", type: "address" },
      { name: "amountIn", internalType: "uint256", type: "uint256" },
    ],
    name: "getAmountOut",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "quoter",
    outputs: [
      { name: "", internalType: "contract IQuoterV2", type: "address" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "tokenAddress", internalType: "address", type: "address" },
      { name: "tokenAmount", internalType: "uint256", type: "uint256" },
      { name: "slippageBps", internalType: "uint256", type: "uint256" },
      { name: "deadline", internalType: "uint256", type: "uint256" },
      { name: "v", internalType: "uint8", type: "uint8" },
      { name: "r", internalType: "bytes32", type: "bytes32" },
      { name: "s", internalType: "bytes32", type: "bytes32" },
    ],
    name: "sellToken",
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [],
    name: "swapRouter",
    outputs: [
      { name: "", internalType: "contract ISwapRouter02", type: "address" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "tokenFactory",
    outputs: [
      { name: "", internalType: "contract ITokenFactory", type: "address" },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "token",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "buyer",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "ethIn",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "tokensOut",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "TokenBought",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "token",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "seller",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "tokensIn",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "ethOut",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "TokenSold",
  },
  { type: "error", inputs: [], name: "ReentrancyGuardReentrantCall" },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenFactoryAbi}__
 */
export const useReadTokenFactory = /*#__PURE__*/ createUseReadContract({
  abi: tokenFactoryAbi,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenFactoryAbi}__ and `functionName` set to `"POOL_FEE"`
 */
export const useReadTokenFactoryPoolFee = /*#__PURE__*/ createUseReadContract({
  abi: tokenFactoryAbi,
  functionName: "POOL_FEE",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenFactoryAbi}__ and `functionName` set to `"TOTAL_SUPPLY"`
 */
export const useReadTokenFactoryTotalSupply =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenFactoryAbi,
    functionName: "TOTAL_SUPPLY",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenFactoryAbi}__ and `functionName` set to `"WETH"`
 */
export const useReadTokenFactoryWeth = /*#__PURE__*/ createUseReadContract({
  abi: tokenFactoryAbi,
  functionName: "WETH",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenFactoryAbi}__ and `functionName` set to `"getPenalty"`
 */
export const useReadTokenFactoryGetPenalty =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenFactoryAbi,
    functionName: "getPenalty",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenFactoryAbi}__ and `functionName` set to `"launches"`
 */
export const useReadTokenFactoryLaunches = /*#__PURE__*/ createUseReadContract({
  abi: tokenFactoryAbi,
  functionName: "launches",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenFactoryAbi}__ and `functionName` set to `"owner"`
 */
export const useReadTokenFactoryOwner = /*#__PURE__*/ createUseReadContract({
  abi: tokenFactoryAbi,
  functionName: "owner",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenFactoryAbi}__ and `functionName` set to `"positionManager"`
 */
export const useReadTokenFactoryPositionManager =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenFactoryAbi,
    functionName: "positionManager",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenFactoryAbi}__ and `functionName` set to `"swapRouter"`
 */
export const useReadTokenFactorySwapRouter =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenFactoryAbi,
    functionName: "swapRouter",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenFactoryAbi}__ and `functionName` set to `"uniswapFactory"`
 */
export const useReadTokenFactoryUniswapFactory =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenFactoryAbi,
    functionName: "uniswapFactory",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenFactoryAbi}__
 */
export const useWriteTokenFactory = /*#__PURE__*/ createUseWriteContract({
  abi: tokenFactoryAbi,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenFactoryAbi}__ and `functionName` set to `"collectFees"`
 */
export const useWriteTokenFactoryCollectFees =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenFactoryAbi,
    functionName: "collectFees",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenFactoryAbi}__ and `functionName` set to `"createTokenAndPool"`
 */
export const useWriteTokenFactoryCreateTokenAndPool =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenFactoryAbi,
    functionName: "createTokenAndPool",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenFactoryAbi}__
 */
export const useSimulateTokenFactory = /*#__PURE__*/ createUseSimulateContract({
  abi: tokenFactoryAbi,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenFactoryAbi}__ and `functionName` set to `"collectFees"`
 */
export const useSimulateTokenFactoryCollectFees =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenFactoryAbi,
    functionName: "collectFees",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenFactoryAbi}__ and `functionName` set to `"createTokenAndPool"`
 */
export const useSimulateTokenFactoryCreateTokenAndPool =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenFactoryAbi,
    functionName: "createTokenAndPool",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenFactoryAbi}__
 */
export const useWatchTokenFactoryEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: tokenFactoryAbi });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenFactoryAbi}__ and `eventName` set to `"FeesCollected"`
 */
export const useWatchTokenFactoryFeesCollectedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenFactoryAbi,
    eventName: "FeesCollected",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenFactoryAbi}__ and `eventName` set to `"PenaltyApplied"`
 */
export const useWatchTokenFactoryPenaltyAppliedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenFactoryAbi,
    eventName: "PenaltyApplied",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenFactoryAbi}__ and `eventName` set to `"TokenCreated"`
 */
export const useWatchTokenFactoryTokenCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenFactoryAbi,
    eventName: "TokenCreated",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenTraderAbi}__
 */
export const useReadTokenTrader = /*#__PURE__*/ createUseReadContract({
  abi: tokenTraderAbi,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenTraderAbi}__ and `functionName` set to `"BPS_DENOMINATOR"`
 */
export const useReadTokenTraderBpsDenominator =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenTraderAbi,
    functionName: "BPS_DENOMINATOR",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenTraderAbi}__ and `functionName` set to `"MAX_SLIPPAGE"`
 */
export const useReadTokenTraderMaxSlippage =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenTraderAbi,
    functionName: "MAX_SLIPPAGE",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenTraderAbi}__ and `functionName` set to `"POOL_FEE"`
 */
export const useReadTokenTraderPoolFee = /*#__PURE__*/ createUseReadContract({
  abi: tokenTraderAbi,
  functionName: "POOL_FEE",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenTraderAbi}__ and `functionName` set to `"TRADING_FEE"`
 */
export const useReadTokenTraderTradingFee = /*#__PURE__*/ createUseReadContract(
  { abi: tokenTraderAbi, functionName: "TRADING_FEE" }
);

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenTraderAbi}__ and `functionName` set to `"WETH"`
 */
export const useReadTokenTraderWeth = /*#__PURE__*/ createUseReadContract({
  abi: tokenTraderAbi,
  functionName: "WETH",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenTraderAbi}__ and `functionName` set to `"feeRecipient"`
 */
export const useReadTokenTraderFeeRecipient =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenTraderAbi,
    functionName: "feeRecipient",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenTraderAbi}__ and `functionName` set to `"quoter"`
 */
export const useReadTokenTraderQuoter = /*#__PURE__*/ createUseReadContract({
  abi: tokenTraderAbi,
  functionName: "quoter",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenTraderAbi}__ and `functionName` set to `"swapRouter"`
 */
export const useReadTokenTraderSwapRouter = /*#__PURE__*/ createUseReadContract(
  { abi: tokenTraderAbi, functionName: "swapRouter" }
);

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenTraderAbi}__ and `functionName` set to `"tokenFactory"`
 */
export const useReadTokenTraderTokenFactory =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenTraderAbi,
    functionName: "tokenFactory",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenTraderAbi}__
 */
export const useWriteTokenTrader = /*#__PURE__*/ createUseWriteContract({
  abi: tokenTraderAbi,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenTraderAbi}__ and `functionName` set to `"buyToken"`
 */
export const useWriteTokenTraderBuyToken = /*#__PURE__*/ createUseWriteContract(
  { abi: tokenTraderAbi, functionName: "buyToken" }
);

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenTraderAbi}__ and `functionName` set to `"getAmountOut"`
 */
export const useWriteTokenTraderGetAmountOut =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenTraderAbi,
    functionName: "getAmountOut",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenTraderAbi}__ and `functionName` set to `"sellToken"`
 */
export const useWriteTokenTraderSellToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenTraderAbi,
    functionName: "sellToken",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenTraderAbi}__
 */
export const useSimulateTokenTrader = /*#__PURE__*/ createUseSimulateContract({
  abi: tokenTraderAbi,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenTraderAbi}__ and `functionName` set to `"buyToken"`
 */
export const useSimulateTokenTraderBuyToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenTraderAbi,
    functionName: "buyToken",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenTraderAbi}__ and `functionName` set to `"getAmountOut"`
 */
export const useSimulateTokenTraderGetAmountOut =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenTraderAbi,
    functionName: "getAmountOut",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenTraderAbi}__ and `functionName` set to `"sellToken"`
 */
export const useSimulateTokenTraderSellToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenTraderAbi,
    functionName: "sellToken",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenTraderAbi}__
 */
export const useWatchTokenTraderEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: tokenTraderAbi });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenTraderAbi}__ and `eventName` set to `"TokenBought"`
 */
export const useWatchTokenTraderTokenBoughtEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenTraderAbi,
    eventName: "TokenBought",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenTraderAbi}__ and `eventName` set to `"TokenSold"`
 */
export const useWatchTokenTraderTokenSoldEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenTraderAbi,
    eventName: "TokenSold",
  });
