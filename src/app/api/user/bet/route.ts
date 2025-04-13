import { prisma } from "@/lib/db";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const connection = new Connection("https://api.devnet.solana.com");

export async function POST(req: NextRequest) {
  try {
    const { signature } = await req.json();

    let retries = 5;
    let txDetails;
    while (retries > 0) {
      txDetails = await connection.getTransaction(signature, {
        commitment: "confirmed",
      });
      if (txDetails) {
        break;
      }
      await new Promise((res) => setTimeout(res, 1000));
    }

    const from = txDetails?.transaction.message.accountKeys[0].toBase58();
    const betAmount =
      txDetails?.meta?.preBalances[0]! - txDetails?.meta?.postBalances[0]!;

    const user = await prisma.user.findUnique({
      where: {
        walletAddress: from,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found!, make sure wallet is connected",
        },
        { status: 400 }
      );
    }

    const bet = await prisma.bet.create({
      data: {
        userId: user.id,
        betAmount: betAmount / LAMPORTS_PER_SOL,
        wonStatus: "BETTING",
      },
    });

    return NextResponse.json({
      message: "Bet Successfully Placed!",
      success: true,
      betId: bet.id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
