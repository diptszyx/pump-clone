"use client";

import { Header } from "@/src/components/layout/Header";
import { HeroSection } from "@/src/components/home/HeroSection";
import { StatsSection } from "@/src/components/home/StatsSection";
import { TokenListingSection } from "@/src/components/token/TokenListingSection";
import { Footer } from "@/src/components/footer";

export default function MoonPump() {
  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-6">
        <HeroSection />
        <StatsSection />
        <TokenListingSection />
      </div>

      <Footer />
    </div>
  );
}
