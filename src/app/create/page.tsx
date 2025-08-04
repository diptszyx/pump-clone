"use client";

import { Header } from "@/src/components/layout/Header";
import { CreateTokenContent } from "@/src/components/create/CreateTokenContent";
import { Footer } from "@/src/components/footer";

export default function CreateTokenPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <CreateTokenContent />
      <Footer />
    </div>
  );
}
