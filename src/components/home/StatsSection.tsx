"use client";

import { useEffect, useState } from "react";
import { Card } from "@/src/components/ui/8bit/card";
import { formatNumber } from "@/src/utils/format";
import { eightBitStyles } from "@/src/styles/8bit-styles";

type Stats = {
  totalMarketCap: number;
  tokens: number;
  tvl: number;
  volume24h: number;
  creatorsRewards: number;
};

export function StatsSection() {
  const [stats, setStats] = useState<Stats | null>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-16 mb-8 px-12">
      <Card
        className="text-white border-0 w-full"
        style={eightBitStyles.statsCard}
      >
        <div className="text-center">
          <div className="text-xs opacity-90 mb-1">Total Market Cap</div>
          <div className="text-xs font-bold">
            ${formatNumber(stats.totalMarketCap)}
          </div>
        </div>
      </Card>

      <Card
        className="text-white border-0 w-full"
        style={eightBitStyles.statsCard}
      >
        <div className="text-center">
          <div className="text-xs opacity-90 mb-1">Tokens</div>
          <div className="text-xs font-bold">{stats.tokens}</div>
        </div>
      </Card>

      <Card
        className="text-white border-0 w-full"
        style={eightBitStyles.statsCard}
      >
        <div className="text-center">
          <div className="text-xs opacity-90 mb-1">TVL</div>
          <div className="text-xs font-bold">${formatNumber(stats.tvl)}</div>
        </div>
      </Card>

      <Card
        className="text-white border-0 w-full"
        style={eightBitStyles.statsCard}
      >
        <div className="text-center">
          <div className="text-xs opacity-90 mb-1">24h Volume</div>
          <div className="text-xs font-bold">
            ${formatNumber(stats.volume24h)}
          </div>
        </div>
      </Card>

      <Card
        className="text-white border-0 w-full"
        style={eightBitStyles.statsCard}
      >
        <div className="text-center">
          <div className="text-xs opacity-90 mb-1">Creators Rewards</div>
          <div className="text-xs font-bold">
            ${formatNumber(stats.creatorsRewards)}
          </div>
        </div>
      </Card>
    </div>
  );
}
