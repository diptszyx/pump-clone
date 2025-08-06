"use client";

import { Button } from "@/src/components/ui/8bit/button";
import { cn } from "@/src/lib/utils";
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
          variant="neon"
          font="retro"
          onClick={() => router.push("/create")}
          className={cn(
            "px-6 py-3 text-sm font-medium shadow-lg",
            "hover:shadow-xl transition-all duration-300",
            "bg-emerald-600 text-white hover:bg-emerald-500",
            "dark:bg-emerald-700 dark:hover:bg-emerald-600"
          )}
        >
          🚀 Create Token
        </Button>
      </div>
    </div>
  );
}
