"use client";

export default function Chart() {
  return (
    <div className="relative w-full">
      <iframe
        src="https://dexscreener.com/ethereum/0xec8389245796d2aba17a1e8b2cc00334e589e5c6?embed=1&theme=dark&trades=0&info=0"
        width="100%"
        height="500"
        frameBorder="0"
        className="rounded-xl"
        style={{ minHeight: "400px" }}
      />

      {/* Loading overlay for better UX */}
      <div className="absolute inset-0 bg-[#0f111a] rounded-xl flex items-center justify-center opacity-0 pointer-events-none">
        <div className="text-gray-400">Loading chart...</div>
      </div>
    </div>
  );
}
