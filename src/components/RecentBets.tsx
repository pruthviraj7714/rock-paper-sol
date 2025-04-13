"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { LucideLoader } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface IBet {
  id: String;
  userId: String;
  computerScore: number;
  userScore: number;
  wonStatus: "WON" | "LOST" | "BETTING";
  createdAt: Date;
  betAmount: number;
  resultAmount: number;
}

const RecentBets = () => {
  const [bets, setBets] = useState<IBet[]>([]);
  const [loading, setLoading] = useState(false);

  const { publicKey } = useWallet();
  const fetchBets = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/user/recent-bets?walletAddress=${publicKey}`
      );
      setBets(res.data.bets);
    } catch (error: any) {
      toast.error(error.response.data.message ?? error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (publicKey) {
      fetchBets();
    }
  }, [publicKey]);

  return (
    <section className="py-12 px-6">
      <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
        Recent Games
      </h2>
      <div className="overflow-hidden rounded-lg border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-left font-medium">Bet Amount</th>
                <th className="px-4 py-3 text-left font-medium">Result</th>
                <th className="px-4 py-3 text-left font-medium">Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={4}>
                    <div className="flex justify-center items-center py-6">
                      <LucideLoader className="animate-spin h-10 w-10" />
                    </div>
                  </td>
                </tr>
              ) : bets && bets.length > 0 ? (
                bets.map((b: IBet) => (
                  <tr key={b.id as string} className="bg-gray-800/50">
                    <td className="px-4 py-3">
                      {new Date(b.createdAt).toDateString()}
                    </td>
                    <td className="px-4 py-3">{Number(b.betAmount).toFixed(2) ?? 0} SOL</td>
                    <td
                      className={`px-4 py-3 ${
                        b.wonStatus === "WON"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {b.wonStatus}
                    </td>
                    <td className="px-4 py-3">{Number(b.resultAmount).toFixed(2) ?? 0} SOL</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-400">
                    No bets found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default RecentBets;
