import { Connection, PublicKey } from "@solana/web3.js";

export const connection = new Connection("https://api.devnet.solana.com");

export const PLATFORM_FEE_PERCENT = 0.05;

export const PLATFORM_WALLET_PUBLIC_KEY = new PublicKey(
  "6U7HnKP3YVedd1utBRwHdYTFN36heDzKzZ79qUdUsJvA"
);
