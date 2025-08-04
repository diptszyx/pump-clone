import axios from "axios";

const DEXSCREENER_API = "https://api.dexscreener.com/latest/dex/tokens";
const ETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

export async function getTokenPriceUsd(
  tokenAddress: string,
  fallbackPrice: number = 0.000006
): Promise<number> {
  try {
    const res = await axios.get(`${DEXSCREENER_API}/${tokenAddress}`);
    const pairs = res.data.pairs;

    if (!pairs || pairs.length === 0) return fallbackPrice;

    const ethPair = pairs.find((pair: any) => pair.chainId === "ethereum");
    return ethPair ? parseFloat(ethPair.priceUsd) : fallbackPrice;
  } catch (err) {
    console.error("Fetch token error:", err);
    return fallbackPrice;
  }
}

export async function getEthPriceUsd(
  fallbackPrice: number = 4000
): Promise<number> {
  return await getTokenPriceUsd(ETH_ADDRESS, fallbackPrice);
}
