export const tokenUtils = {
  ethToWei: (ethAmount: string): bigint =>
    BigInt(Math.floor(parseFloat(ethAmount) * 1e18)),
  weiToEth: (weiAmount: bigint): string =>
    (Number(weiAmount) / 1e18).toString(),
  percentToBps: (percent: number): bigint => BigInt(percent * 100),

  tokenToWei: (tokenAmount: string, decimals: number): bigint =>
    BigInt(Math.floor(parseFloat(tokenAmount) * Math.pow(10, decimals))),

  weiToToken: (weiAmount: bigint, decimals: number): string => {
    const divisor = Math.pow(10, decimals);
    return (Number(weiAmount) / divisor).toString();
  },

  formatTokenAmount: (
    weiAmount: bigint,
    decimals: number,
    displayDecimals: number = 2
  ): string => {
    const amount = Number(weiAmount) / Math.pow(10, decimals);
    return amount.toFixed(displayDecimals);
  },
};
