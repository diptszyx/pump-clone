"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import { formatNumber } from "@/src/utils/format";

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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      <Card className="bg-gradient-to-r from-pink-400 to-purple-500 text-white border-0 rounded-2xl">
        <CardContent className="p-4">
          <div className="text-sm opacity-90">Total Market Cap</div>
          <div className="text-2xl font-bold">
            ${formatNumber(stats.totalMarketCap)}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border border-gray-800 rounded-2xl">
        <CardContent className="p-4">
          <div className="text-sm text-gray-300">Tokens</div>
          <div className="text-2xl font-bold text-white">{stats.tokens}</div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border border-gray-800 rounded-2xl">
        <CardContent className="p-4">
          <div className="text-sm text-gray-300">TVL</div>
          <div className="text-2xl font-bold text-white">
            ${formatNumber(stats.tvl)}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border border-gray-800 rounded-2xl">
        <CardContent className="p-4">
          <div className="text-sm text-gray-300">24h Volume</div>
          <div className="text-2xl font-bold text-white">
            ${formatNumber(stats.volume24h)}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border border-gray-800 rounded-2xl">
        <CardContent className="p-4">
          <div className="text-sm text-gray-300">Creators Rewards</div>
          <div className="text-2xl font-bold text-white">
            ${formatNumber(stats.creatorsRewards)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
