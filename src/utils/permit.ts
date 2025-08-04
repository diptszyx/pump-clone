import { PublicClient, WalletClient, Address } from "viem";
import type { TypedDataDomain } from "viem";

const ERC20_PERMIT_ABI = [
  {
    name: "DOMAIN_SEPARATOR",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "bytes32" }],
  },
  {
    name: "nonces",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "name",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
] as const;

export interface PermitSignature {
  deadline: number;
  v: number;
  r: `0x${string}`;
  s: `0x${string}`;
}

export class PermitError extends Error {
  constructor(message: string) {
    super(`Permit generation failed: ${message}`);
    this.name = "PermitError";
  }
}

export async function generatePermitSignature(
  tokenAddress: Address,
  spender: Address,
  amount: bigint,
  owner: Address,
  walletClient: WalletClient,
  publicClient: PublicClient
): Promise<PermitSignature> {
  try {
    const [nameResult, nonceResult] = await Promise.all([
      publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_PERMIT_ABI,
        functionName: "name",
      }),
      publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_PERMIT_ABI,
        functionName: "nonces",
        args: [owner],
      }),
    ]);

    if (typeof nameResult !== "string") {
      throw new PermitError("Invalid token name type");
    }
    if (typeof nonceResult !== "bigint") {
      throw new PermitError("Invalid nonce type");
    }

    const name = nameResult;
    const nonce = nonceResult;

    const deadline = Math.floor(Date.now() / 1000) + 3600;

    const chainId = await publicClient.getChainId();

    const domain: TypedDataDomain = {
      name,
      version: "1",
      chainId,
      verifyingContract: tokenAddress,
    };

    const types = {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    } as const;

    const message = {
      owner,
      spender,
      value: amount,
      nonce,
      deadline: BigInt(deadline),
    };

    const signature = await walletClient.signTypedData({
      account: owner,
      domain,
      types,
      primaryType: "Permit",
      message,
    });

    if (signature.length !== 132) {
      throw new PermitError("Invalid signature length");
    }

    const r = signature.slice(0, 66) as `0x${string}`;
    const s = `0x${signature.slice(66, 130)}` as `0x${string}`;
    const vHex = signature.slice(130, 132);
    const v = parseInt(vHex, 16);

    if (r.length !== 66 || s.length !== 66 || isNaN(v)) {
      throw new PermitError("Invalid signature components");
    }

    return {
      deadline,
      v,
      r,
      s,
    };
  } catch (error) {
    if (error instanceof PermitError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.message.includes("User rejected")) {
        throw new PermitError("User rejected signature request");
      }
      if (error.message.includes("does not support")) {
        throw new PermitError("Token does not support permit");
      }
      throw new PermitError(`Unexpected error: ${error.message}`);
    }

    throw new PermitError("Unknown error occurred");
  }
}
