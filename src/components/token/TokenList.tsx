"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Globe, Send, Twitter } from "lucide-react";
import { LoadingSpinner, Skeleton } from "@/src/components/ui/loading";
import { socialUtils } from "@/src/utils/socialLinks";
import { formatNumber } from "@/src/utils/format";
import { Button } from "@/src/components/ui/8bit/button";
import { cn } from "@/src/lib/utils";
import { eightBitStyles } from "@/src/styles/8bit-styles";

type TokenMetadata = {
  name: string;
  symbol: string;
  description?: string;
  image?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
};

type TokenFromDB = {
  id: number;
  address: string;
  creator: string;
  tokenURI: string;
  createdAt: string;
  tvl: number;
  marketCap: number;
  metadata: TokenMetadata | null;
};

export function TokenList() {
  const router = useRouter();
  const [tokens, setTokens] = useState<TokenFromDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const tokensPerPage = 10;

  const fetchTokens = async () => {
    try {
      const res = await fetch("/api/token", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (!res.ok) throw new Error("Failed to fetch tokens");
      const data = await res.json();
      setTokens(data);
    } catch (error) {
      console.error("Error fetching tokens:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
    const interval = setInterval(fetchTokens, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimeAgo = (date: string) => {
    const timestamp = new Date(date).getTime();
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="text-white flex items-center justify-between p-6 min-h-[100px]"
            style={eightBitStyles.tokenCard}
          >
            <div className="flex items-center gap-4 flex-1">
              <Skeleton className="w-20 h-20 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-6 w-40 mb-3" />
                <Skeleton className="h-5 w-20 mb-3" />
                <div className="flex gap-3">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-4 rounded" />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-11 w-28 rounded-lg" />
            </div>
          </div>
        ))}

        <div className="text-center py-8">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-400">Loading tokens...</p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(tokens.length / tokensPerPage);
  const startIndex = (currentPage - 1) * tokensPerPage;
  const endIndex = startIndex + tokensPerPage;
  const currentTokens = tokens.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:items-center px-4 py-2 text-gray-400 text-sm font-medium border-b border-gray-800">
        <div className="col-span-5">Token</div>
        <div className="col-span-2 text-center">Market Cap</div>
        <div className="col-span-2 text-center">Creator</div>
        <div className="col-span-1 text-center">Age</div>
        <div className="col-span-2 text-center">Action</div>
      </div>

      <div className="space-y-6 px-4">
        {currentTokens.map((token) => (
          <div
            key={token.id}
            className="text-white p-6 hover:brightness-110 transition-all cursor-pointer"
            style={eightBitStyles.tokenCard}
          >
            <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:items-center md:min-h-[88px]">
              <div className="col-span-5 flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-700/50 flex-shrink-0">
                  <Image
                    src={token.metadata?.image || "/placeholder.png"}
                    alt={token.metadata?.name || "Token"}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-white text-lg truncate">
                    {token.metadata?.name || "Unknown Token"}
                  </h3>
                  <div className="text-gray-400 text-base">
                    ${token.metadata?.symbol || ""}
                  </div>
                  <div className="flex gap-3 mt-2">
                    {token.metadata?.website && (
                      <a
                        href={token.metadata.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="w-4 h-4 text-green-400 hover:text-green-300" />
                      </a>
                    )}
                    {token.metadata?.twitter && (
                      <a
                        href={socialUtils.getTwitterUrl(token.metadata.twitter)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Twitter className="w-4 h-4 text-sky-400 hover:text-sky-400" />{" "}
                      </a>
                    )}
                    {token.metadata?.telegram && (
                      <a
                        href={socialUtils.getTelegramUrl(
                          token.metadata.telegram
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Send className="w-4 h-4 text-blue-400 hover:text-blue-300" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-span-2 text-center">
                <div className="text-white text-lg font-semibold">
                  {formatNumber(token.marketCap)}
                </div>
              </div>

              <div className="col-span-2 text-center">
                <div className="text-white  text-base">
                  {token.creator.slice(0, 6)}...{token.creator.slice(-4)}
                </div>
              </div>
              <div className="col-span-1 text-center">
                <div className="text-gray-400 text-base">
                  {formatTimeAgo(token.createdAt)}
                </div>
              </div>
              <div className="col-span-2 flex flex-col items-center justify-center gap-2">
                <Button
                  size="lg"
                  variant="neon"
                  font="retro"
                  onClick={() => router.push(`/token/${token.address}`)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium shadow-lg",
                    "hover:shadow-xl transition-all duration-300",
                    "bg-emerald-600 text-white hover:bg-emerald-500",
                    "dark:bg-emerald-700 dark:hover:bg-emerald-600"
                  )}
                >
                  Buy
                </Button>
              </div>
            </div>

            <div className="md:hidden">
              <div className="flex items-center justify-between py-2 min-h-[76px]">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-16 h-16 flex-shrink-0">
                    <Image
                      src={token.metadata?.image || "/placeholder.png"}
                      alt={token.metadata?.name || "Token"}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-white text-base truncate">
                      {token.metadata?.name || "Unknown Token"}
                    </h3>
                    <div className="text-gray-400 text-sm">
                      ${token.metadata?.symbol || ""}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-white text-base font-semibold">
                      {formatNumber(token.marketCap)}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {formatTimeAgo(token.createdAt)}
                    </div>
                  </div>
                  {/* <Badge className="bg-blue-500/10 text-blue-400 border-0 rounded-full text-sm">
                    V3
                  </Badge> */}
                  <Button
                    size="lg"
                    variant="neon"
                    font="retro"
                    onClick={() => router.push(`/token/${token.address}`)}
                    className={cn(
                      "px-6 py-3 text-xs font-medium shadow-lg",
                      "hover:shadow-xl transition-all duration-300",
                      "bg-gradient-to-r from-gray-500 to-gray-600",
                      "hover:from-gray-400 hover:to-gray-500"
                    )}
                  >
                    Buy
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-transparent border-gray-700 text-white hover:bg-gray-800"
          >
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={
                  currentPage === page
                    ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                    : "bg-transparent border-gray-700 text-white hover:bg-gray-800"
                }
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="bg-transparent border-gray-700 text-white hover:bg-gray-800"
          >
            Next
          </Button>
        </div>
      )}

      {/* Results Info */}
      <div className="text-center text-gray-400 text-sm mt-4">
        Showing {startIndex + 1}-{Math.min(endIndex, tokens.length)} of{" "}
        {tokens.length} tokens
      </div>
    </div>
  );
}
