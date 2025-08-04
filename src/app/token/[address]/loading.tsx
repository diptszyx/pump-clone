import { Header } from "@/src/components/layout/Header";
import { LoadingSpinner } from "@/src/components/ui/loading";

export default function Loading() {
  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Simple centered loading */}
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" className="mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Loading Token</h2>
          <p className="text-gray-400">
            Fetching token information and market data...
          </p>
        </div>
      </div>
    </div>
  );
}
