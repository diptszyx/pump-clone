"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";

import { Label } from "@/src/components/ui/label";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/components/ui/collapsible";
import {
  Upload,
  LinkIcon,
  ChevronRight,
  ChevronDown,
  Globe,
  MessageCircle,
  Twitter,
} from "lucide-react";

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

interface TokenFormProps {
  formData: FormData;
  previewImage: string;
  handleInputChange: (
    _field: string,
    _value: string | number | File | null
  ) => void;
  handleImageUpload: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAvatarClick: () => void;
  isCreating?: boolean;
}

export function TokenForm({
  formData,
  previewImage,
  handleInputChange,
  handleImageUpload,
  handleAvatarClick,
  isCreating = false,
}: TokenFormProps) {
  const [socialLinksOpen, setSocialLinksOpen] = useState(false);

  function calculatePenalty(ethAmount: number): number {
    if (ethAmount < 0.05) return 0;
    if (ethAmount >= 0.3) return 5000;
    const slope = 18000;
    const delta = ethAmount - 0.05;
    return 500 + delta * slope;
  }

  const penalty = calculatePenalty(Number(formData.initialPurchase)) / 100;

  return (
    <div className="space-y-4">
      <div className="bg-[#1a1d2e] rounded-xl p-4 border border-gray-800/50">
        <h3 className="text-lg font-semibold text-white mb-4">
          Token Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="name"
              className="text-gray-300 text-xs font-medium mb-1 block"
            >
              Token Name *
            </Label>
            <Input
              id="name"
              placeholder="e.g., My Awesome Token"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={isCreating}
              className="bg-[#0f111a] border-gray-700/50 text-white placeholder-gray-500 rounded-lg h-10"
            />
          </div>
          <div>
            <Label
              htmlFor="symbol"
              className="text-gray-300 text-xs font-medium mb-1 block"
            >
              Symbol *
            </Label>
            <Input
              id="symbol"
              placeholder="e.g., MAT"
              value={formData.symbol}
              onChange={(e) =>
                handleInputChange("symbol", e.target.value.toUpperCase())
              }
              disabled={isCreating}
              className="bg-[#0f111a] border-gray-700/50 text-white placeholder-gray-500 rounded-lg h-10"
            />
          </div>
        </div>

        <div className="mt-4">
          <Label
            htmlFor="description"
            className="text-gray-300 text-xs font-medium mb-1 block"
          >
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Describe your token and its purpose..."
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            disabled={isCreating}
            className="bg-[#0f111a] border-gray-700/50 text-white placeholder-gray-500 rounded-lg min-h-[80px]"
          />
        </div>
      </div>

      <div className="bg-[#1a1d2e] rounded-xl p-4 border border-gray-800/50">
        <h3 className="text-lg font-semibold text-white mb-3">Token Image</h3>

        <div className="flex items-center gap-4">
          <div
            onClick={isCreating ? undefined : handleAvatarClick}
            className={`${isCreating ? "opacity-70" : "cursor-pointer hover:opacity-80"} transition-opacity`}
          >
            {previewImage ? (
              <Avatar className="w-16 h-16">
                <Image
                  src={previewImage || "/placeholder.svg"}
                  alt="Token preview"
                  className="w-full h-full object-cover"
                  width={64}
                  height={64}
                />
              </Avatar>
            ) : (
              <Avatar className="w-16 h-16 bg-gray-700 hover:bg-gray-600 transition-colors">
                <AvatarFallback className="text-gray-400 flex flex-col items-center gap-1">
                  <Upload className="w-4 h-4" />
                  <span className="text-xs">Upload</span>
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          <div className="flex-1">
            <p className="text-gray-300 text-xs mb-2">
              Upload image (512x512px)
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleAvatarClick}
              disabled={isCreating}
              className="bg-[#0f111a] border-gray-700/50 text-white hover:bg-gray-700/50 rounded-lg h-8 text-xs"
            >
              <Upload className="w-3 h-3 mr-1" />
              Choose Image
            </Button>
          </div>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isCreating}
            className="hidden"
          />
        </div>
      </div>

      <div className="bg-[#1a1d2e] rounded-xl p-4 border border-gray-800/50">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>💰</span>
          Initial Purchase
        </h3>

        <div className="space-y-3">
          <div className="relative">
            <Input
              id="initialPurchase"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0"
              value={formData.initialPurchase}
              onChange={(e) =>
                handleInputChange("initialPurchase", e.target.value)
              }
              disabled={isCreating}
              className="bg-[#0f111a] border-gray-700/50 text-white placeholder-gray-500 rounded-lg h-10 pr-12"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
              ETH
            </div>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <div className="text-orange-400 text-sm">⚠️</div>
              <div>
                <div className="text-orange-400 font-semibold text-xs mb-1">
                  Penalty {penalty.toFixed(1)}%
                </div>
                <p className="text-gray-300 text-xs leading-relaxed">
                  Penalty is dynamically calculated based on your initial
                  purchase and will go to the liquidity pool.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1d2e] rounded-xl p-4 border border-gray-800/50">
        <Collapsible
          open={socialLinksOpen}
          onOpenChange={isCreating ? undefined : setSocialLinksOpen}
          disabled={isCreating}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              disabled={isCreating}
              className="w-full justify-between text-white hover:text-blue-400 hover:bg-gray-700/50 p-0 h-auto mb-3"
            >
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                <span className="text-lg font-semibold">
                  Social Links (Optional)
                </span>
              </div>
              {socialLinksOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3">
            <div>
              <Label
                htmlFor="website"
                className="text-gray-300 text-xs font-medium mb-1 block flex items-center gap-1"
              >
                <Globe className="w-3 h-3" />
                Website
              </Label>
              <Input
                id="website"
                placeholder="https://yourtoken.com"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                disabled={isCreating}
                className="bg-[#0f111a] border-gray-700/50 text-white placeholder-gray-500 rounded-lg h-10"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label
                  htmlFor="twitter"
                  className="text-gray-300 text-xs font-medium mb-1 block flex items-center gap-1"
                >
                  <Twitter className="w-3 h-3" />
                  Twitter
                </Label>
                <Input
                  id="twitter"
                  placeholder="@yourtoken"
                  value={formData.twitter}
                  onChange={(e) => handleInputChange("twitter", e.target.value)}
                  disabled={isCreating}
                  className="bg-[#0f111a] border-gray-700/50 text-white placeholder-gray-500 rounded-lg h-10"
                />
              </div>
              <div>
                <Label
                  htmlFor="telegram"
                  className="text-gray-300 text-xs font-medium mb-1 block flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3" />
                  Telegram
                </Label>
                <Input
                  id="telegram"
                  placeholder="@yourtoken"
                  value={formData.telegram}
                  onChange={(e) =>
                    handleInputChange("telegram", e.target.value)
                  }
                  disabled={isCreating}
                  className="bg-[#0f111a] border-gray-700/50 text-white placeholder-gray-500 rounded-lg h-10"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
