import { prisma } from "@/src/lib/prisma/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tokenCount = await prisma.token.count();

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const volume24h = await prisma.transaction.aggregate({
      _sum: {
        valueUsd: true,
      },
      where: {
        createdAt: {
          gte: since,
        },
        type: {
          in: ["BUY", "SELL"],
        },
      },
    });

    const creatorsRewards = await prisma.transaction.aggregate({
      _sum: { valueUsd: true },
      where: {
        type: "REWARD",
      },
    });

    const tokenStats = await prisma.token.aggregate({
      _sum: {
        marketCap: true,
        tvl: true,
      },
    });

    const stats = {
      totalMarketCap: tokenStats._sum.marketCap,
      tokens: tokenCount,
      tvl: tokenStats._sum.marketCap,
      volume24h: volume24h._sum.valueUsd || 0,
      creatorsRewards: creatorsRewards._sum.valueUsd || 0,
    };

    return NextResponse.json(stats);
  } catch (err) {
    console.error("API Stats Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
