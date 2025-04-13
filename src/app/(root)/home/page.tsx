import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coins } from "lucide-react";
import RecentBets from "@/components/RecentBets";

export default function HomePage() {
  const betOptions = [0.1, 0.2, 0.5, 1, 2, 5];

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-white">
      <div className=" py-8">
        <section className="py-12">
          <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
            Choose Your Bet
          </h2>
          <p className="mb-8 text-center text-lg text-gray-400">
            Select how much SOL you want to bet. Win the game and double your
            money!
          </p>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-3 mx-7">
            {betOptions.map((amount) => (
            <Link href={`/game?bet=${amount}`} key={amount}>
            <Card className="w-[330px] bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl rounded-2xl border border-gray-700 hover:scale-105 hover:shadow-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 ease-in-out">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="mb-2 text-3xl font-extrabold text-yellow-400 drop-shadow-md">
                  {amount} SOL
                </p>
                <p className="text-sm text-gray-400">
                  Win <span className="text-green-400 font-semibold">{amount * 2} SOL</span>
                </p>
                <Button className="mt-6 cursor-pointer w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-md shadow hover:shadow-lg transition">
                  Select
                </Button>
              </CardContent>
            </Card>
          </Link>
          
            ))}
          </div>
        </section>
        <RecentBets />
      </div>

      <footer className="mt-auto border-t bg-gray-950/80 backdrop-blur-md text-white border-gray-800 py-8">
        <div className="">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Coins className="h-6 w-6 text-yellow-500" />
              <span className="text-lg font-bold">Rock Paper Sol</span>
            </div>
            <p className="text-sm text-gray-400">
              © 2025 Rock Paper Sol. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
