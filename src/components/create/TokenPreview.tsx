"use client";

import Image from "next/image";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Globe, MessageCircle, Twitter } from "lucide-react";

type FormData = {
  name: string;
  symbol: string;
  description: string;
  website: string;
  twitter: string;
  telegram: string;
  image: File | null;
  initialPurchase: string;
};

interface TokenPreviewProps {
  formData: FormData;
  previewImage: string;
  currentStep: number;
  isCreating: boolean;
  handleCreateToken: () => void;
}

export function TokenPreview({
  formData,
  previewImage,
  currentStep,
  isCreating,
  handleCreateToken,
}: TokenPreviewProps) {
  const isFormValid = formData.name && formData.symbol;

  const showSuccessMessage = currentStep === 4;
  const showLaunchButton =
    currentStep === 1 || (!showSuccessMessage && !isCreating);

  return (
    <div className="space-y-4">
      <div className="bg-[#1a1d2e] rounded-xl p-4 border border-gray-800/50">
        <h3 className="text-lg font-semibold text-white mb-4">Token Preview</h3>

        <div className="flex items-center gap-3 mb-4">
          {previewImage ? (
            <Avatar className="w-14 h-14">
              <Image
                src={previewImage || "/placeholder.svg"}
                alt="Token preview"
                className="w-full h-full object-cover"
                width={56}
                height={56}
              />
            </Avatar>
          ) : (
            <Avatar className="w-14 h-14 bg-gray-700">
              <AvatarFallback className="text-gray-400 text-lg font-bold">
                {formData.symbol ? formData.symbol.charAt(0) : "?"}
              </AvatarFallback>
            </Avatar>
          )}

          <div className="flex-1">
            <div className="text-white font-bold text-base">
              {formData.name || "Token Name"}
            </div>
            <div className="text-gray-400 text-sm font-medium">
              ${formData.symbol || "SYMBOL"}
            </div>
            <div className="text-gray-500 text-xs mt-1">ERC-20 Token</div>
          </div>
        </div>

        <div className="space-y-3">
          {formData.description ? (
            <div>
              <div className="text-gray-300 text-xs font-medium mb-1">
                Description
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                {formData.description}
              </p>
            </div>
          ) : (
            <div>
              <div className="text-gray-300 text-xs font-medium mb-1">
                Description
              </div>
              <p className="text-gray-500 text-xs italic">
                No description provided
              </p>
            </div>
          )}

          {formData.initialPurchase && (
            <div>
              <div className="text-gray-300 text-xs font-medium mb-1">
                Initial Purchase
              </div>
              <div className="text-white text-sm font-medium">
                {formData.initialPurchase} ETH
              </div>
            </div>
          )}

          {formData.website || formData.twitter || formData.telegram ? (
            <div>
              <div className="text-gray-300 text-xs font-medium mb-2">
                Social Links
              </div>
              <div className="flex flex-wrap gap-1">
                {formData.website && (
                  <Badge variant="outline" className="text-xs">
                    <Globe className="w-3 h-3 mr-1" />
                    Website
                  </Badge>
                )}
                {formData.twitter && (
                  <Badge variant="outline" className="text-xs">
                    <Twitter className="w-3 h-3 mr-1" />
                    Twitter
                  </Badge>
                )}
                {formData.telegram && (
                  <Badge variant="outline" className="text-xs">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Telegram
                  </Badge>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-gray-300 text-xs font-medium mb-1">
                Social Links
              </div>
              <div className="text-gray-500 text-xs italic">
                No social links provided
              </div>
            </div>
          )}

          <div className="border-t border-gray-700 pt-3">
            <div className="text-gray-300 text-xs font-medium mb-2">
              Token Specifications
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-gray-400">Total Supply</div>
                <div className="text-white font-medium">1,000,000,000</div>
              </div>
              <div>
                <div className="text-gray-400">Decimals</div>
                <div className="text-white font-medium">18</div>
              </div>
              <div>
                <div className="text-gray-400">Network</div>
                <div className="text-white font-medium">Ethereum</div>
              </div>
              <div>
                <div className="text-gray-400">Standard</div>
                <div className="text-white font-medium">ERC-20</div>
              </div>
              <div>
                <div className="text-gray-400">Trading Fee</div>
                <div className="text-white font-medium">1%</div>
              </div>
              <div>
                <div className="text-gray-400">Liquidity</div>
                <div className="text-white font-medium">Auto-added</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showLaunchButton && (
        <>
          <Button
            onClick={handleCreateToken}
            disabled={isCreating || !isFormValid}
            className="w-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 hover:from-purple-600 hover:via-blue-600 hover:to-cyan-500 text-white py-3 text-base font-semibold shadow-lg rounded-xl"
          >
            🚀 Launch Token
          </Button>

          <p className="text-xs text-gray-400 text-center leading-tight">
            By creating a token, you agree to our Terms of Service and
            understand that token creation is irreversible.
          </p>
        </>
      )}

      {isCreating && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
          <div className="w-8 h-8 border-4 border-t-blue-500 border-blue-500/30 rounded-full animate-spin mx-auto mb-3"></div>
          <div className="text-blue-400 font-bold text-sm mb-1">
            Creating Your Token...
          </div>
          <div className="text-gray-300 text-xs">
            Please wait while your token is being deployed to the blockchain
          </div>
        </div>
      )}

      {showSuccessMessage && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">🎉</div>
          <div className="text-green-400 font-bold text-sm mb-1">
            Token Created Successfully!
          </div>
          <div className="text-gray-300 text-xs">
            Your token is now live on Uniswap and ready for trading!
          </div>
        </div>
      )}
    </div>
  );
}
