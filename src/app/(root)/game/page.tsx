"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Hand, Loader2, Scissors, Square, Trophy, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { useWallet } from "@solana/wallet-adapter-react"
import axios from "axios"
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js"

type Choice = "rock" | "paper" | "scissors" | null
type GameResult = "win" | "lose" | "draw" | null

const PLATFORM_WALLET_PUBLIC_KEY = new PublicKey("6U7HnKP3YVedd1utBRwHdYTFN36heDzKzZ79qUdUsJvA")

const connection = new Connection("https://api.devnet.solana.com")

export default function GamePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const betAmount = Number.parseFloat(searchParams.get("bet") || "0.1")

  const { publicKey, sendTransaction, signMessage } = useWallet()
  const [playerChoice, setPlayerChoice] = useState<Choice>(null)
  const [computerChoice, setComputerChoice] = useState<Choice>(null)
  const [roundResult, setRoundResult] = useState<GameResult>(null)
  const [playerScore, setPlayerScore] = useState(0)
  const [computerScore, setComputerScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [playerMoves, setPlayerMoves] = useState<Choice[]>([])
  const [computerMoves, setComputerMoves] = useState<Choice[]>([])
  const [gameResult, setGameResult] = useState<GameResult>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [startMatch, setStartMatch] = useState(false)
  const [isStartingMatch, setIsStartingMatch] = useState(false)
  const [betId, setBetId] = useState<string | null>(null)
  const [fetchingResult, setFetchingResult] = useState(false)

  const makeComputerChoice = () => {
    const choices: Choice[] = ["rock", "paper", "scissors"]
    return choices[Math.floor(Math.random() * choices.length)]
  }

  const determineWinner = (player: Choice, computer: Choice): GameResult => {
    if (!player || !computer) return null
    if (player === computer) return "draw"
    if (
      (player === "rock" && computer === "scissors") ||
      (player === "paper" && computer === "rock") ||
      (player === "scissors" && computer === "paper")
    ) {
      return "win"
    }
    return "lose"
  }

  const handleMatchStart = async () => {
    if (!publicKey) return
    setIsStartingMatch(true)
    try {
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: PLATFORM_WALLET_PUBLIC_KEY,
          lamports: betAmount * LAMPORTS_PER_SOL,
        }),
      )

      const signature = await sendTransaction(tx, connection)
      const latestBlockhash = await connection.getLatestBlockhash()

      await connection.confirmTransaction({ signature, ...latestBlockhash }, "finalized")

      const res = await axios.post("/api/user/bet", {
        signature,
      })

      if (res.data.success) {
        setStartMatch(true)
        setBetId(res.data.betId)
      }
    } catch (error: any) {
      toast.error(error.response.data.message ?? error.message)
    } finally {
      setIsStartingMatch(false)
    }
  }

  const handleChoice = (choice: Choice) => {
    if (gameOver || isAnimating) return

    setIsAnimating(true)
    setPlayerChoice(choice)
    setComputerChoice(null)

    setTimeout(() => {
      const compChoice = makeComputerChoice()
      setComputerChoice(compChoice)

      const result = determineWinner(choice, compChoice)
      setRoundResult(result)

      if (result === "win") {
        setPlayerScore((prev) => prev + 1)
      } else if (result === "lose") {
        setComputerScore((prev) => prev + 1)
      }

      setComputerMoves((prev) => [...prev, compChoice])
      setPlayerMoves((prev) => [...prev, choice])
      setIsAnimating(false)
    }, 1000)
  }

  const handleGameResult = async () => {
    if (!signMessage) {
      toast.error("Your connected wallet does not support message signing.")
      return
    }

    setFetchingResult(true)
    try {
      const payload = {
        playerMoves,
        computerMoves,
        betAmount,
        nonce: crypto.randomUUID(),
      }

      const message = JSON.stringify(payload)

      const messageBytes = new TextEncoder().encode(message)
      const signature = await signMessage(messageBytes)

      const res = await axios.post("api/user/result", {
        signature: Buffer.from(signature).toString("base64"),
        payload,
        publicKey,
        betId,
      })

      setGameOver(true)
      if (res.data.success) {
        setGameResult("win")
      } else {
        setGameResult("lose")
      }
    } catch (error: any) {
      toast.error(error.response.data.message ?? error.message)
    } finally {
      setFetchingResult(false)
    }
  }

  const resetGame = () => {
    setPlayerChoice(null)
    setComputerChoice(null)
    setRoundResult(null)
    setPlayerScore(0)
    setComputerScore(0)
    setGameOver(false)
    setGameResult(null)
    setPlayerMoves([])
    setComputerMoves([])
    setStartMatch(false)
  }

  const getChoiceIcon = (choice: Choice) => {
    switch (choice) {
      case "rock":
        return <Square className="h-12 w-12" />
      case "paper":
        return <Hand className="h-12 w-12" />
      case "scissors":
        return <Scissors className="h-12 w-12" />
      default:
        return <div className="h-12 w-12 rounded-full bg-gray-700"></div>
    }
  }

  useEffect(() => {
    if (playerScore >= 3 || computerScore >= 3) {
      handleGameResult()
    }
  }, [playerScore, computerScore])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6">
        <Link
          href="/home"
          className="mb-8 inline-flex items-center text-yellow-400 transition-colors hover:text-yellow-300"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span className="text-lg font-medium">Back to Home</span>
        </Link>

        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
            Rock Paper Sol
          </h1>
          <div className="mt-4 sm:mt-0 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 p-[1px]">
            <div className="rounded-xl bg-gray-900 px-6 py-2">
              <span className="font-bold text-yellow-400">Bet: {betAmount} SOL</span>
            </div>
          </div>
        </div>

        {gameOver ? (
          <Card className="overflow-hidden border-0 bg-gray-800 shadow-xl">
            <div className={`h-2 w-full ${gameResult === "win" ? "bg-green-500" : "bg-red-500"}`}></div>
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              {gameResult === "win" ? (
                <div className="mb-6 rounded-full bg-green-500/20 p-4">
                  <Trophy className="h-16 w-16 text-green-500" />
                </div>
              ) : (
                <div className="mb-6 rounded-full bg-red-500/20 p-4">
                  <AlertTriangle className="h-16 w-16 text-red-500" />
                </div>
              )}

              <h2 className="mb-2 text-3xl text-white font-bold">{gameResult === "win" ? "You Won!" : "You Lost!"}</h2>
              <p className="mb-8 text-xl text-gray-300">
                {gameResult === "win" ? `Congratulations! You've won ${betAmount * 2} SOL!` : "Better luck next time!"}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={resetGame}
                  variant="outline"
                  className="border-2 border-yellow-500 bg-transparent text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300"
                >
                  Play Again
                </Button>
                <Button
                  onClick={() => router.push("/home")}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 hover:from-yellow-600 hover:to-yellow-700"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-8 border-0 bg-gray-800/50 shadow-xl backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex flex-col items-center">
                    <h2 className="mb-2 text-xl font-bold text-gray-200">You</h2>
                    <div className="mb-4 text-4xl font-bold text-yellow-400">{playerScore}</div>
                    <div className="relative">
                      <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-gray-700/70 shadow-inner transition-all duration-300">
                        {playerChoice ? (
                          <div className="text-yellow-400">{getChoiceIcon(playerChoice)}</div>
                        ) : (
                          <span className="text-3xl font-bold text-gray-500">?</span>
                        )}
                      </div>
                      {playerChoice && (
                        <div className="absolute -bottom-3 text-yellow-400 left-1/2 -translate-x-1/2 rounded-full bg-gray-800 px-3 py-1 text-sm font-medium capitalize">
                          {playerChoice}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-2 text-2xl font-bold text-gray-400">VS</div>
                    {roundResult && (
                      <div
                        className={`mb-4 rounded-lg px-4 py-2 text-center font-bold ${
                          roundResult === "win"
                            ? "bg-green-500/20 text-green-400"
                            : roundResult === "lose"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-gray-600/20 text-gray-400"
                        }`}
                      >
                        {roundResult === "win"
                          ? "You win round!"
                          : roundResult === "lose"
                            ? "Computer wins round!"
                            : "Draw!"}
                      </div>
                    )}
                    <div className="text-sm text-gray-400 bg-gray-700/50 rounded-full px-4 py-1">First to 3 wins!</div>

                    {playerMoves.length > 0 && (
                      <div className="mt-4 flex gap-1">
                        {playerMoves.map((move, index) => (
                          <div
                            key={index}
                            className={`h-2 w-2 rounded-full ${
                              computerMoves[index] === move
                                ? "bg-gray-500"
                                : determineWinner(move, computerMoves[index] as Choice) === "win"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center">
                    <h2 className="mb-2 text-xl font-bold text-gray-200">Computer</h2>
                    <div className="mb-4 text-4xl font-bold text-red-400">{computerScore}</div>
                    <div className="relative">
                      <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-gray-700/70 shadow-inner transition-all duration-300">
                        {computerChoice ? (
                          <div className="text-red-400">{getChoiceIcon(computerChoice)}</div>
                        ) : (
                          <span className="text-3xl font-bold text-gray-500">?</span>
                        )}
                      </div>
                      {computerChoice && (
                        <div className="absolute -bottom-3 left-1/2 text-red-400 -translate-x-1/2 rounded-full bg-gray-800 px-3 py-1 text-sm font-medium capitalize">
                          {computerChoice}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => handleChoice("rock")}
                disabled={isAnimating || !startMatch}
                className={`group relative h-28 overflow-hidden rounded-xl border-0 bg-gradient-to-br ${
                  !startMatch
                    ? "from-gray-700/50 to-gray-800/50 text-gray-400"
                    : "from-gray-700 to-gray-800 text-white hover:from-gray-600 hover:to-gray-700"
                } p-0 shadow-lg transition-all duration-300`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center gap-2 p-4">
                    <Square
                      className={`h-10 w-10 transition-transform duration-300 ${startMatch ? "group-hover:scale-110" : ""}`}
                    />
                    <span className="font-medium">Rock</span>
                  </div>
                </div>
                {startMatch && (
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                )}
              </Button>

              <Button
                onClick={() => handleChoice("paper")}
                disabled={isAnimating || !startMatch}
                className={`group relative h-28 overflow-hidden rounded-xl border-0 bg-gradient-to-br ${
                  !startMatch
                    ? "from-gray-700/50 to-gray-800/50 text-gray-400"
                    : "from-gray-700 to-gray-800 text-white hover:from-gray-600 hover:to-gray-700"
                } p-0 shadow-lg transition-all duration-300`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center gap-2 p-4">
                    <Hand
                      className={`h-10 w-10 transition-transform duration-300 ${startMatch ? "group-hover:scale-110" : ""}`}
                    />
                    <span className="font-medium">Paper</span>
                  </div>
                </div>
                {startMatch && (
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                )}
              </Button>

              <Button
                onClick={() => handleChoice("scissors")}
                disabled={isAnimating || !startMatch}
                className={`group relative h-28 overflow-hidden rounded-xl border-0 bg-gradient-to-br ${
                  !startMatch
                    ? "from-gray-700/50 to-gray-800/50 text-gray-400"
                    : "from-gray-700 to-gray-800 text-white hover:from-gray-600 hover:to-gray-700"
                } p-0 shadow-lg transition-all duration-300`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center gap-2 p-4">
                    <Scissors
                      className={`h-10 w-10 transition-transform duration-300 ${startMatch ? "group-hover:scale-110" : ""}`}
                    />
                    <span className="font-medium">Scissors</span>
                  </div>
                </div>
                {startMatch && (
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                )}
              </Button>
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleMatchStart}
                disabled={startMatch || isStartingMatch}
                className={`relative overflow-hidden rounded-xl px-8 py-3 text-lg font-medium ${
                  startMatch || isStartingMatch
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 hover:from-yellow-600 hover:to-yellow-700"
                } shadow-lg transition-all duration-300`}
              >
                {isStartingMatch ? (
                  <div className="flex items-center gap-2 cursor-pointer">
                    <span>Initializing</span>
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                ) : (
                  <span>{startMatch ? "Game in Progress" : "Play Game"}</span>
                )}
                {!startMatch && !isStartingMatch && (
                  <div className="absolute -inset-1 -z-10 opacity-30 blur-md bg-yellow-400" />
                )}
              </Button>
            </div>
          </>
        )}
      </div>

      {isStartingMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-80 rounded-2xl bg-gray-900 p-6 shadow-2xl border border-gray-800">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative h-16 w-16">
                <Loader2 className="absolute inset-0 h-full w-full animate-spin text-yellow-500" />
                <div className="absolute inset-0 h-full w-full animate-pulse rounded-full bg-yellow-500/20"></div>
              </div>
              <h3 className="text-xl font-bold text-white">Initializing Your Match</h3>
              <p className="text-center text-gray-400">
                Please don&apos;t close or refresh the screen while we set up your game
              </p>
            </div>
          </div>
        </div>
      )}

      {fetchingResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-80 rounded-2xl bg-gray-900 p-6 shadow-2xl border border-gray-800">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative h-16 w-16">
                <Loader2 className="absolute inset-0 h-full w-full animate-spin text-yellow-500" />
                <div className="absolute inset-0 h-full w-full animate-pulse rounded-full bg-yellow-500/20"></div>
              </div>
              <h3 className="text-xl font-bold text-white">Fetching Match Results</h3>
              <p className="text-center text-gray-400">
                Please don&apos;t close or refresh the screen while we verify your game
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
