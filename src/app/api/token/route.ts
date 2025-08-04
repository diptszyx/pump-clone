import { prisma } from "@/src/lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  const { address, creator, tokenURI } = await req.json();

  if (!address || !creator || !tokenURI) {
    return NextResponse.json(
      { error: "Address, creator, and tokenURI are required" },
      { status: 400 }
    );
  }

  try {
    const token = await prisma.token.create({
      data: { address, creator, tokenURI, tvl: 6000, marketCap: 6000 },
    });

    return NextResponse.json(token);
  } catch (err: unknown) {
    let errorMessage = "Failed to create token";
    let statusCode = 500;

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P1001") {
        errorMessage = "Cannot connect to database";
      } else if (err.code === "P2002") {
        errorMessage = "Token with this address already exists";
        statusCode = 409;
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

export async function GET() {
  try {
    const tokens = await prisma.token.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        address: true,
        creator: true,
        tokenURI: true,
        createdAt: true,
        marketCap: true,
        tvl: true,
      },
    });

    const tokensWithMetadata = await Promise.all(
      tokens.map(async (token) => {
        try {
          const res = await axios.get(token.tokenURI);
          return {
            ...token,
            metadata: res.data as {
              name: string;
              symbol: string;
              description?: string;
              image?: string;
              website?: string;
              twitter?: string;
              telegram?: string;
            },
          };
        } catch (err) {
          console.error(`Lỗi fetch metadata từ ${token.tokenURI}:`, err);
          return { ...token, metadata: null };
        }
      })
    );

    return NextResponse.json(tokensWithMetadata);
  } catch (err) {
    console.error("API Route: Lỗi khi lấy danh sách token:", err);
    return NextResponse.json(
      { error: "Failed to fetch tokens" },
      { status: 500 }
    );
  }
}
