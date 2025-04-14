import Link from "next/link";
import { Coins } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-800 bg-gray-900 py-8 px-5">
      <div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Coins className="h-6 w-6 text-yellow-500" />
            <span className="text-lg text-white font-bold">Rock Paper Sol</span>
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
          <p className="text-sm text-gray-400">
            © 2025 Rock Paper Sol. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
