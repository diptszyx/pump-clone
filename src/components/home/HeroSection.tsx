"use client";

import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const router = useRouter();

  return (
    <div className="text-center py-12">
      <h1 className="text-5xl font-bold text-white mb-4">
        Launch an Ethereum coin in seconds
      </h1>
      <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
        Create, launch, and share your own token in a few clicks. No code. No
        hassle.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          size="lg"
          onClick={() => router.push("/create")}
          className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 hover:from-purple-600 hover:via-blue-600 hover:to-cyan-500 text-white px-10 py-6 rounded-2xl shadow-lg text-xl font-medium"
        >
          🚀 Create Token
        </Button>
      </div>
    </div>
  );
}
