"use client";

import * as React from "react";
import { WagmiProvider, createConfig } from "wagmi";
import { mainnet, sepolia, arbitrum, optimism, polygon } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { injected, walletConnect } from "wagmi/connectors";
import { http } from "viem";

const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY;

const projectId =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ||
  "f972e0e7e96efcd9059b678ec2e10ae1";

const chains = [mainnet, sepolia, arbitrum, optimism, polygon] as const;

const metadata = {
  name: "Moon Pump",
  description: "Create, launch, and share your own token in seconds",
  url: "https://moonpump.app",
  icons: ["https://moonpump.app/favicon.ico"],
};

export const config = createConfig({
  chains,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [polygon.id]: http(),
  },
  connectors: [
    injected(),
    walletConnect({ projectId, metadata, showQrModal: false }),
  ],
});

// Tạo Web3Modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#3b82f6", // Màu chủ đạo
    "--w3m-border-radius-master": "8px",
  },
  enableAnalytics: false, // Tắt phân tích (analytics)
  featuredWalletIds: [
    "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // MetaMask
    "ecc4036f814562b41a5268adc86270fba1365471402006302e70169465b7ac18", // Trust Wallet
  ],
});

// Tạo QueryClient cho React Query
const queryClient = new QueryClient();

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
