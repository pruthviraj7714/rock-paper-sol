"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";

export default function ConnectWalletPage() {
  const { connected, publicKey } = useWallet();
  const router = useRouter();

  useEffect(() => {
    const connectUser = async () => {
      if (connected) {
        if (publicKey) {
          try {
            const res = await axios.post("/api/user/connect", {
              publicKey,
            });
            if (res.data.success) {
              router.push("/home");
            }
          } catch (error: any) {
            console.log(error);
            toast.error(error.message);
          }
        }
      }
    };
    connectUser();
  }, [connected]);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="border hover:border-slate-900 rounded">
        <WalletMultiButton />
      </div>
    </main>
  );
}