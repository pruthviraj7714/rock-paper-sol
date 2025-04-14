"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Coins,
  AlertTriangle,
  Sparkles,
  Rocket,
  Hand,
  Scissors,
  FileText,
} from "lucide-react";
import RecentBets from "@/components/RecentBets";

export default function HomePage() {
  const betOptions = [0.1, 0.2, 0.5, 1, 2, 5];
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <Alert className="border-yellow-600 bg-yellow-950/60 backdrop-blur-sm text-yellow-200 rounded-none">
        <AlertTriangle className="h-4 w-4 text-yellow-400" />
        <AlertDescription className="flex items-center justify-center w-full text-center font-medium">
          🚧 Currently running on Devnet only - Play for fun! No real SOL will
          be used. 🚧
        </AlertDescription>
      </Alert>

      <div
        className={`py-12 px-4 text-center transition-all duration-700 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 opacity-75 blur-sm"></div>
            <div className="relative bg-gray-900 rounded-full p-4">
              <Coins className="h-16 w-16 text-yellow-500" />
            </div>
          </div>
        </div>
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 text-transparent bg-clip-text">
          Rock Paper Sol
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          The classic game with a Solana twist. Choose your bet, play the game,
          and double your SOL!
        </p>
      </div>

      <div className="flex justify-center gap-8 mb-8">
        <div className="animate-float-slow bg-gray-800/50 p-4 rounded-full border border-gray-700">
          <Hand className="h-10 w-10 text-yellow-400" />
        </div>
        <div className="animate-float-medium bg-gray-800/50 p-4 rounded-full border border-gray-700">
          <FileText className="h-10 w-10 text-yellow-400" />
        </div>
        <div className="animate-float-fast bg-gray-800/50 p-4 rounded-full border border-gray-700">
          <Scissors className="h-10 w-10 text-yellow-400" />
        </div>
      </div>

      <section
        className={`py-8 px-4 transition-all duration-1000 delay-300 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-6 text-center text-3xl font-bold md:text-4xl flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-yellow-400 mr-2" /> Choose Your
            Bet
          </h2>
          <p className="mb-10 text-center text-lg text-gray-300">
            Select how much SOL you want to bet. Win the game and double your
            money!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {betOptions.map((amount, index) => (
              <Link
                href={`/game?bet=${amount}`}
                key={amount}
                className="w-full max-w-xs"
              >
                <Card
                  className={`w-full bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl rounded-2xl border border-gray-700 
                  hover:scale-105 hover:shadow-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 ease-in-out
                  hover:border-yellow-500/50 group overflow-hidden relative
                  ${
                    isLoaded
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/10 to-yellow-500/0 opacity-0 group-hover:opacity-100 transform translate-x-full group-hover:translate-x-[-200%] transition-all duration-1500"></div>
                  <CardContent className="flex flex-col items-center justify-center p-8">
                    <div className="mb-4 bg-gray-800/80 p-3 rounded-full border border-gray-700 group-hover:border-yellow-500/50 transition-all">
                      <Coins className="h-8 w-8 text-yellow-400" />
                    </div>
                    <p className="mb-2 text-4xl font-extrabold text-yellow-400 drop-shadow-md group-hover:text-yellow-300 transition-colors">
                      {amount} SOL
                    </p>
                    <p className="text-sm text-gray-400 mb-6">
                      Win{" "}
                      <span className="text-green-400 font-semibold">
                        {amount * 2} SOL
                      </span>
                    </p>
                    <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-md shadow hover:shadow-lg transition">
                      Play Now
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 shadow-xl">
        <RecentBets />
      </div>
    </div>
  );
}
