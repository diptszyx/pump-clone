import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import TokenFactoryABI from "@/src/abi/TokenFactory.json";
import TokenTraderABI from "@/src/abi/TokenTrader.json";
import { Abi } from "viem";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [
    {
      name: "TokenFactory",
      abi: TokenFactoryABI.abi as Abi,
    },
    {
      name: "TokenTrader",
      abi: TokenTraderABI.abi as Abi,
    },
  ],
  plugins: [react()],
});
