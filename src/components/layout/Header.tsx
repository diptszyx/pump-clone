"use client";

import { Rocket } from "lucide-react";
import { WalletConnect } from "@/src/components/wallet-connect";
import Link from "next/link";

export function Header() {
  return (
    <header className="bg-black/90 backdrop-blur-sm border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 via-emerald-500 to-lime-400 rounded-2xl flex items-center justify-center transform rotate-12 shadow-lg">
              <Rocket className="w-6 h-6 text-white transform -rotate-12" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-lime-400 bg-clip-text text-transparent">
              MOON PUMP
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <WalletConnect />
        </div>
      </div>
    </header>
  );
}
