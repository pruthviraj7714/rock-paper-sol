import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const publicKey = req.nextUrl.searchParams.get("walletAddress");

    if (!publicKey) {
      return NextResponse.json(
        { message: "Missing walletAddress" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        walletAddress: publicKey,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "No user found with this wallet address in db",
        },
        { status: 400 }
      );
    }

    const bets = await prisma.bet.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    });

    return NextResponse.json(
      {
        bets,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error!",
      },
      { status: 500 }
    );
  }
}
