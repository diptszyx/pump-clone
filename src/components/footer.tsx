import { Button } from "@/src/components/ui/button";
import { Twitter, Github, MessageCircle, Rocket } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900/90 backdrop-blur-sm border-t border-gray-700 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto px-6 py-12 flex justify-center">
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 via-emerald-500 to-lime-400 rounded-xl flex items-center justify-center transform rotate-12">
                <Rocket className="w-6 h-6 text-white transform -rotate-12" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-lime-400 bg-clip-text text-transparent">
                MOON PUMP
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto">
              Launch your own cryptocurrency in seconds. Create, trade, and earn
              with the most advanced token creation platform on Ethereum.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-gray-800"
              >
                <Twitter className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-gray-800"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-gray-800"
              >
                <Github className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © 2025 Moon Pump. All rights reserved.
          </div>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>All systems operational</span>
            </div>
            <div className="text-sm text-gray-400">Built on Ethereum</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
