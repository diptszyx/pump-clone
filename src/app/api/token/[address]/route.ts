import { prisma } from "@/src/lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;

  try {
    const token = await prisma.token.findUnique({ where: { address } });
    if (!token) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }

    let metadata = null;
    try {
      const res = await axios.get(token.tokenURI);
      metadata = res.data;
    } catch (err) {
      console.error(`Failed to fetch metadata for ${address}`, err);
    }

    return NextResponse.json({ ...token, metadata });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
