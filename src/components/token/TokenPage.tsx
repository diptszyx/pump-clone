"use client";

import Chart from "./Chart";
import TokenInfo from "./TokenInfo";
import TradeBox from "./TradeBox";
import Transactions from "./Transactions";
import { Token } from "@/src/types/token";

export default function TokenPage({ token }: { token: Token }) {
  return (
    <div className="min-h-screen bg-[#0f111a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-[#1a1d2e] rounded-2xl p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-4 text-white">
                Price Chart
              </h2>
              <Chart />
            </div>

            <div className="bg-[#1a1d2e] rounded-2xl p-4 sm:p-6">
              <Transactions token={token} />
            </div>
          </div>

          <div className="space-y-6">
            <TokenInfo token={token} />
            <TradeBox token={token} />
          </div>
        </div>
      </div>
    </div>
  );
}
