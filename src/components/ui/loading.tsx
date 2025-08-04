"use client";

import { cn } from "@/src/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-2",
    xl: "w-12 h-12 border-4",
  };

  return (
    <div
      className={cn(
        "rounded-full border-gray-600 border-t-blue-500 animate-spin",
        sizeClasses[size],
        className
      )}
      style={{
        animation: "spin 1s linear infinite",
      }}
    />
  );
}

interface LoadingDotsProps {
  className?: string;
}

export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={cn("flex space-x-1", className)}>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
    </div>
  );
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-shimmer rounded-md bg-gray-700/50", className)}
    />
  );
}

interface TokenPageLoadingProps {
  className?: string;
}

export function TokenPageLoading({ className }: TokenPageLoadingProps) {
  return (
    <div className={cn("min-h-screen bg-[#0f111a] text-white", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Chart and Transactions Loading */}
          <div className="xl:col-span-2 space-y-6">
            {/* Chart Loading */}
            <div className="bg-[#1a1d2e] rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-5 w-24" />
                <LoadingDots />
              </div>
              <div className="relative">
                <Skeleton className="h-[400px] w-full rounded-xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <LoadingSpinner size="xl" className="mx-auto mb-4" />
                    <p className="text-gray-400 text-sm">
                      Loading price chart...
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions Loading */}
            <div className="bg-[#1a1d2e] rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-5 w-32" />
                <LoadingDots />
              </div>

              {/* Desktop Table Skeleton */}
              <div className="hidden md:block">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex gap-4 pb-3 border-b border-gray-700/50">
                    {[
                      "Time",
                      "Type",
                      "Price",
                      "Amount",
                      "Value",
                      "User",
                      "Tx",
                    ].map((header) => (
                      <Skeleton key={header} className="h-4 flex-1" />
                    ))}
                  </div>
                  {/* Rows */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex gap-4 py-2">
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-4 w-6" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Cards Skeleton */}
              <div className="md:hidden space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-[#0f111a] rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-6" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Token Info and Trade Box Loading */}
          <div className="space-y-6">
            {/* Token Info Loading */}
            <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800/50">
              <div className="flex items-center gap-4 mb-6">
                <Skeleton className="w-20 h-20 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700/50">
                <div className="flex gap-3">
                  <Skeleton className="h-12 flex-1 rounded-xl" />
                  <Skeleton className="h-12 flex-1 rounded-xl" />
                  <Skeleton className="h-12 flex-1 rounded-xl" />
                </div>
              </div>
            </div>

            {/* Trade Box Loading */}
            <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800/50">
              <div className="mb-6">
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-4 w-40" />
              </div>

              {/* Mode Toggle */}
              <div className="flex mb-6 bg-[#0f111a] rounded-xl p-1">
                <Skeleton className="h-12 flex-1 rounded-lg" />
                <Skeleton className="h-12 flex-1 rounded-lg" />
              </div>

              {/* Input/Output */}
              <div className="space-y-4 mb-6">
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                </div>
              </div>

              {/* Trading Info */}
              <Skeleton className="h-16 w-full rounded-lg mb-6" />

              {/* Trade Button */}
              <Skeleton className="h-14 w-full rounded-xl mb-4" />

              {/* Quick Amounts */}
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 flex-1 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
