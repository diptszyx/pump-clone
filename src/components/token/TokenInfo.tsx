"use client";

import Image from "next/image";
import { Globe, Twitter, Send } from "lucide-react";
import { Token } from "@/src/types/token";
import { socialUtils } from "@/src/utils/socialLinks";

export default function TokenInfo({ token }: { token: Token }) {
  const meta = token.metadata || {};

  return (
    <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800/50 shadow-lg">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <Image
            src={meta.image || "/placeholder.png"}
            alt={meta.name || "Token"}
            width={80}
            height={80}
            className="rounded-full border-2 border-gray-700/50"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl font-bold text-white truncate mb-1">
            {meta.name || "Unknown Token"}
          </h3>
          <p className="text-gray-400 text-xl font-medium">
            {meta.description || "TOKEN"}
          </p>
        </div>
      </div>

      {(meta.website || meta.twitter || meta.telegram) && (
        <div className="pt-4 border-t border-gray-700/50">
          <div className="flex gap-3 justify-center">
            {meta.website && (
              <a
                href={meta.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 bg-[#0f111a] hover:bg-gray-700/50 rounded-xl transition-colors flex-1 justify-center"
                title="Website"
              >
                <Globe className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-white font-medium">Website</span>
              </a>
            )}
            {meta.twitter && (
              <a
                href={socialUtils.getTwitterUrl(meta.twitter)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 bg-[#0f111a] hover:bg-gray-700/50 rounded-xl transition-colors flex-1 justify-center"
                title="Twitter"
              >
                <Twitter className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-white font-medium">Twitter</span>
              </a>
            )}
            {meta.telegram && (
              <a
                href={socialUtils.getTelegramUrl(meta.telegram)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 bg-[#0f111a] hover:bg-gray-700/50 rounded-xl transition-colors flex-1 justify-center"
                title="Telegram"
              >
                <Send className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-white font-medium">Telegram</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
