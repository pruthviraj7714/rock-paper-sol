"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { Coins, CoinsIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function Navbar() {
  const { disconnect, disconnecting } = useWallet();

  const router = useRouter();
  return (
    <div className="px-4 lg:px-6 h-16 flex items-center justify-between bg-gray-950/80 backdrop-blur-md text-white border-b border-gray-800">
      <div
        onClick={() => router.push("/home")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <Coins className="h-6 w-6 text-yellow-500" />
        <span className="text-lg font-bold">Rock Paper Sol</span>
      </div>

      <div className="flex">
        <Button
          onClick={() => {
            disconnect();
            router.push("/");
          }}
          className="cursor-pointer"
          variant={"destructive"}
        >
          {disconnecting ? "Disconnecting" : "Disconnect"}
        </Button>
      </div>
    </div>
  );
}
