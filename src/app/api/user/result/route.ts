import { prisma } from "@/lib/db";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";
import bs58 from "bs58";
import nacl from "tweetnacl";

const PLATFORM_WALLET = Keypair.fromSecretKey(
  bs58.decode(process.env.PRIVATE_KEY!)
);
const connection = new Connection("https://api.devnet.solana.com");

const PLATFORM_FEE_PERCENT = 0.05;

export async function POST(req: NextRequest) {
  try {
    const { signature, payload, publicKey, betId } = await req.json();

    const isValid = nacl.sign.detached.verify(
      new TextEncoder().encode(JSON.stringify(payload)),
      Uint8Array.from(Buffer.from(signature, "base64")),
      new PublicKey(publicKey).toBytes()
    );

    if (!isValid) {
      return NextResponse.json(
        {
          message: "Invalid Signature!",
        },
        { status: 403 }
      );
    }

    const bet = await prisma.bet.findUnique({
      where: {
        id: betId,
      },
    });

    if (!bet) {
      return NextResponse.json(
        {
          message: "Bet not found!",
        },
        { status: 400 }
      );
    }

    const { computerMoves, playerMoves, betAmount } = payload;

    let userScore = 0;
    let computerScore = 0;

    let bets = {
      rock: "scissors",
      scissors: "paper",
      paper: "rock",
    };

    for (let i = 0; i < computerMoves.length; i++) {
      const computerMove = computerMoves[i];
      const playerMove = playerMoves[i];

      if (computerMove === playerMove) {
        //draw
        //@ts-ignore
      } else if (bets[computerMove] === playerMove) {
        computerScore += 1;
      } else {
        userScore += 1;
      }

      if (userScore >= 3 || computerScore >= 3) break;
    }

    if (computerScore === 3) {
      await prisma.bet.update({
        where: {
          id: betId,
        },
        data: {
          computerScore,
          userScore,
          wonStatus: "LOST",
        },
      });

      return NextResponse.json(
        {
          message: "You Lost! Better Luck Next Time!",
          success: false,
        },
        { status: 200 }
      );
    } else {
      const winningAmount = betAmount * 2;
      const amountAfterPlatformFee = winningAmount * (1 - PLATFORM_FEE_PERCENT);

      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: PLATFORM_WALLET.publicKey,
          toPubkey: publicKey,
          lamports: Math.floor(amountAfterPlatformFee * LAMPORTS_PER_SOL),
        })
      );

      const signature = await connection.sendTransaction(tx, [PLATFORM_WALLET]);

      const latestBlockHash = await connection.getLatestBlockhash();

      await connection.confirmTransaction({
        ...latestBlockHash,
        signature,
      });

      await prisma.bet.update({
        where: {
          id: betId,
        },
        data: {
          computerScore,
          userScore,
          wonStatus: "WON",
          resultAmount: amountAfterPlatformFee,
        },
      });

      return NextResponse.json({
        message: "Congratulations!, You Won!",
        success: true,
      });
    }
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Internal Server Error!",
      },
      { status: 500 }
    );
  }
}
