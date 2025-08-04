import { prisma } from "@/src/lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

const PAGE_SIZE = 10;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tokenAddress = searchParams.get("tokenAddress");
    const page = parseInt(searchParams.get("page") || "1", 10);

    if (!tokenAddress) {
      return NextResponse.json(
        { error: "Missing tokenAddress" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * PAGE_SIZE;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          tokenAddress,
          type: { in: ["BUY", "SELL"] },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: PAGE_SIZE,
      }),
      prisma.transaction.count({
        where: {
          tokenAddress,
          type: { in: ["BUY", "SELL"] },
        },
      }),
    ]);

    return NextResponse.json({
      transactions,
      total,
      page,
      totalPages: Math.ceil(total / PAGE_SIZE),
    });
  } catch (err) {
    console.error("Failed to fetch transactions:", err);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { tokenAddress, userAddress, type, amount, valueUsd, txHash } =
      await req.json();

    if (!tokenAddress || !userAddress || !type || !amount || !valueUsd) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: { tokenAddress, userAddress, type, amount, valueUsd, txHash },
    });

    return NextResponse.json(transaction);
  } catch (err) {
    console.error("Failed to save transaction:", err);
    return NextResponse.json(
      { error: "Failed to save transaction" },
      { status: 500 }
    );
  }
}
