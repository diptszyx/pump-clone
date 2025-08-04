import type React from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { WalletProvider } from "@/src/components/wallet-provider";
import { updateTokenInfo } from "@/src/lib/db/token";

export const metadata: Metadata = {
  title: "Moon Pump - Launch Ethereum Tokens",
  description:
    "Create, launch, and share your own token in seconds. No code. No hassle.",
  keywords: ["ethereum", "token", "crypto", "launch", "create token", "ERC20"],
  authors: [{ name: "Moon Pump Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

let updaterStarted = false;

async function initTokenUpdater() {
  if (updaterStarted) return;
  updaterStarted = true;

  console.log(" Starting token updater...");

  try {
    await updateTokenInfo();
    console.log("Initial token update completed");

    setInterval(
      async () => {
        try {
          console.log("Running scheduled token update...");
          await updateTokenInfo();
          console.log("Scheduled token update completed");
        } catch (err) {
          console.error("Token updater error:", err);
        }
      },
      5 * 60 * 1000
    );
  } catch (err) {
    console.error("Failed to start token updater:", err);
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (typeof window === "undefined") {
    initTokenUpdater();
  }

  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white min-h-screen">
        <WalletProvider>
          {children}
          <Toaster />
          <div id="wagmi-chains"></div>
        </WalletProvider>
      </body>
    </html>
  );
}
