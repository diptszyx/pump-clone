"use client";

import Chart from "./Chart";
import TokenInfo from "./TokenInfo";
import TradeBox from "./TradeBox";
import Transactions from "./Transactions";
import { Token } from "@/src/types/token";
import { eightBitStyles } from "@/src/styles/8bit-styles";

export default function TokenPage({ token }: { token: Token }) {
  return (
    <div className="min-h-screen bg-[#0f111a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left column (Chart + Transactions) */}
          <div className="xl:col-span-2 flex flex-col gap-8">
            {/* Chart card */}
            <div
              className="text-white p-4 sm:p-6"
              style={eightBitStyles.tokenCard}
            >
              <h2 className="text-lg font-semibold mb-4 text-white">
                Price Chart
              </h2>
              <Chart />
            </div>

            {/* Transactions card */}
            <div
              className="text-white p-4 sm:p-6"
              style={eightBitStyles.tokenCard}
            >
              <Transactions token={token} />
            </div>
          </div>

          {/* Right column (Token Info + Trade Box) */}
          <div className="flex flex-col gap-8">
            {/* Token Info card */}
            <div
              className="text-white p-4 sm:p-6"
              style={eightBitStyles.tokenCard}
            >
              <TokenInfo token={token} />
            </div>

            {/* Trade Box card */}
            <div
              className="text-white p-4 sm:p-6"
              style={eightBitStyles.tokenCard}
            >
              <TradeBox token={token} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
