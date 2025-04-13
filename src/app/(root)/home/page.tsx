import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Coins } from "lucide-react";

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
                <Card className="bg-gray-800 w-[330px] transition-all hover:scale-105 hover:bg-gray-700">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <p className="mb-2 text-2xl font-bold text-yellow-500">
                      {amount} SOL
                    </p>
                    <p className="text-sm text-gray-300">
                      Win {amount * 2} SOL
                    </p>
                    <Button className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600">
                      Select
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="py-12">
          <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
            Recent Games
          </h2>
          <div className="overflow-hidden rounded-lg border border-gray-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Player</th>
                    <th className="px-4 py-3 text-left font-medium">
                      Bet Amount
                    </th>
                    <th className="px-4 py-3 text-left font-medium">Result</th>
                    <th className="px-4 py-3 text-left font-medium">Payout</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  <tr className="bg-gray-800/50">
                    <td className="px-4 py-3">Player1</td>
                    <td className="px-4 py-3">0.5 SOL</td>
                    <td className="px-4 py-3 text-green-500">Win</td>
                    <td className="px-4 py-3">1.0 SOL</td>
                  </tr>
                  <tr className="bg-gray-800/30">
                    <td className="px-4 py-3">Player2</td>
                    <td className="px-4 py-3">1.0 SOL</td>
                    <td className="px-4 py-3 text-red-500">Loss</td>
                    <td className="px-4 py-3">0 SOL</td>
                  </tr>
                  <tr className="bg-gray-800/50">
                    <td className="px-4 py-3">Player3</td>
                    <td className="px-4 py-3">2.0 SOL</td>
                    <td className="px-4 py-3 text-green-500">Win</td>
                    <td className="px-4 py-3">4.0 SOL</td>
                  </tr>
                  <tr className="bg-gray-800/30">
                    <td className="px-4 py-3">Player4</td>
                    <td className="px-4 py-3">0.2 SOL</td>
                    <td className="px-4 py-3 text-red-500">Loss</td>
                    <td className="px-4 py-3">0 SOL</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-auto border-t border-gray-800 bg-gray-900 py-8">
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
