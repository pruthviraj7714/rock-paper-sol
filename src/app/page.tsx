import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Coins, Trophy, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-white">
      <header className="border-b border-gray-800 bg-gray-900 py-4 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="h-8 w-8 text-yellow-500" />
            <h1 className="text-lg font-mono">Rock Paper Sol</h1>
          </div>
          <nav className="hidden space-x-6 md:flex">
            <Link href="/" className="font-medium hover:text-yellow-500">
              Home
            </Link>
            <Link href="#how-to-play" className="font-medium hover:text-yellow-500">
              How to Play
            </Link>
            <Link href="#" className="font-medium hover:text-yellow-500">
              Leaderboard
            </Link>
          </nav>
          <Link href={'/connect-wallet'}>
            <Button className="bg-yellow-500 hover:bg-yellow-600 cursor-pointer">Connect Wallet</Button>
          </Link>
        </div>
      </header>

      <section className="py-16 md:py-24 mx-10">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Play. Bet. <span className="text-yellow-500">Win SOL.</span>
            </h2>
            <p className="text-xl text-gray-400">
              Challenge the computer to Rock Paper Scissors with SOL bets. Win 3 rounds first and double your money!
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Link href="/connect-wallet">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600">
                  Start Playing
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-yellow-500 text-yellow-500 hover:text-white hover:bg-yellow-500/10">
                Learn More
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-64 w-64 md:h-80 md:w-80">
              <div className="absolute left-0 top-0 h-full w-full rounded-full bg-purple-500/20 blur-3xl"></div>
              <div className="relative flex h-full items-center justify-center">
                <div className="flex gap-4">
                  <div className="h-16 w-16 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
                  <div className="h-16 w-16 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                  <div className="h-16 w-16 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-to-play" className="bg-gray-800 py-16 md:py-24 px-10">
        <div className="">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">How to Play</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500">
                <Coins className="h-6 w-6 text-gray-900" />
              </div>
              <h3 className="mb-2 text-xl font-bold">1. Choose Your Bet</h3>
              <p className="text-gray-400">
                Select how much SOL you want to bet. The higher the bet, the bigger the potential reward.
              </p>
            </div>
            <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500">
                <Zap className="h-6 w-6 text-gray-900" />
              </div>
              <h3 className="mb-2 text-xl font-bold">2. Play the Game</h3>
              <p className="text-gray-400">
                Choose rock, paper, or scissors each round. First to win 3 rounds takes the prize!
              </p>
            </div>
            <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500">
                <Trophy className="h-6 w-6 text-gray-900" />
              </div>
              <h3 className="mb-2 text-xl font-bold">3. Collect Your Winnings</h3>
              <p className="text-gray-400">Win the game and double your bet! Lose, and your bet goes to the house.</p>
            </div>
          </div>
          <div className="mt-12 flex justify-center">
            <Link href="/connect-wallet">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600">
                Start Playing Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="mt-auto border-t border-gray-800 bg-gray-900 py-8 px-5">
        <div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Coins className="h-6 w-6 text-yellow-500" />
              <span className="text-lg font-bold">Rock Paper Sol</span>
            </div>
            <div className="flex gap-6">
              <Link href="#" className="text-gray-400 hover:text-yellow-500">
                Terms
              </Link>
              <Link href="#" className="text-gray-400 hover:text-yellow-500">
                Privacy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-yellow-500">
                Contact
              </Link>
            </div>
            <p className="text-sm text-gray-400">© 2025 Rock Paper Sol. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
