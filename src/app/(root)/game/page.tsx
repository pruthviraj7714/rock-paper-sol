import GameClient from "@/components/GameClient";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function GamePage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-900">
          <Loader2 className="animate-spin w-10 h-10 text-white" />
          <p className="text-sm text-white">Loading game, please wait...</p>
        </div>
      }
    >
      <GameClient />
    </Suspense>
  );
}
