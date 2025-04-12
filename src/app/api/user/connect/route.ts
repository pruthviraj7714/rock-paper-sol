import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { publicKey } = await req.json();

    if (!publicKey) {
      return NextResponse.json(
        {
          message: "Public Key is missing!",
        },
        { status: 400 }
      );
    }

    const isUserExists = await prisma.user.findUnique({
      where: {
        walletAddress: publicKey,
      },
    });

    if (isUserExists) {
      return NextResponse.json({
        message: "User Already Exists",
        success: true,
      });
    }

    await prisma.user.create({
        data : {
            walletAddress : publicKey
        }
    })

    return NextResponse.json(
      {
        message: "User Successfully Created!",
        success: true,
      },
      { status: 200 }
    );
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