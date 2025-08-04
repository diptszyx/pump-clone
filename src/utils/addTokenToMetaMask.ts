import axios from "axios";

export async function addTokenToMetaMask(
  tokenAddress: `0x${string}`,
  symbol: string,
  decimals: number,
  tokenURI?: string
) {
  try {
    let image: string | undefined;

    if (tokenURI) {
      try {
        const res = await axios.get(tokenURI);
        image = res.data.image;
      } catch (err) {
        console.error(`Failed to fetch metadata from ${tokenURI}:`, err);
      }
    }

    const wasAdded = await (window as any).ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: tokenAddress,
          symbol,
          decimals,
          image,
        },
      },
    });

    if (wasAdded) {
      console.log(`${symbol} added to MetaMask!`);
    } else {
      console.warn("User rejected token add request");
    }
  } catch (error) {
    console.error("Error adding token to MetaMask:", error);
  }
}
