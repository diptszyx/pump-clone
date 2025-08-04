"use client";

import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { useCreateToken } from "@/src/hooks/useTokenActions";
import { useWatchTokenFactoryTokenCreatedEvent } from "@/src/generated";
import { TOKEN_FACTORY_ADDRESS } from "@/src/constants/contracts";
import { uploadTokenMetadata } from "@/src/utils/uploadMetadata";
import { useAccount } from "wagmi";
import * as React from "react";
import { addTokenToMetaMask } from "@/src/utils/addTokenToMetaMask";

export type FormData = {
  name: string;
  symbol: string;
  description: string;
  website: string;
  twitter: string;
  telegram: string;
  image: File | null;
  initialPurchase: string;
};

export function useTokenCreation() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [createdTokenAddress, setCreatedTokenAddress] = useState<
    `0x${string}` | null
  >(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    symbol: "",
    description: "",
    website: "",
    twitter: "",
    telegram: "",
    image: null,
    initialPurchase: "0",
  });
  const [previewImage, setPreviewImage] = useState<string>("");
  const tokenURIRef = useRef<string>("");
  const { address: creator } = useAccount();
  const { createToken } = useCreateToken();

  const saveTokenToDatabase = useCallback(
    async (tokenAddress: string) => {
      try {
        const response = await fetch("/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            address: tokenAddress,
            creator,
            tokenURI: tokenURIRef.current,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save token to DB");
        }
      } catch (err) {
        console.error("Error saving token to DB:", err);
      }
    },
    [creator]
  );

  useWatchTokenFactoryTokenCreatedEvent({
    address: TOKEN_FACTORY_ADDRESS,
    onLogs: useCallback(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async (logs: any[]) => {
        if (logs.length > 0 && isCreating) {
          const tokenAddress = logs[0].args?.token;
          if (tokenAddress) {
            setCreatedTokenAddress(tokenAddress);
            setCurrentStep(4);
            setIsCreating(false);

            await saveTokenToDatabase(tokenAddress);

            await addTokenToMetaMask(
              tokenAddress,
              formData.symbol,
              18,
              tokenURIRef.current
            );

            toast.success(
              `Token Created: ${formData.name} (${formData.symbol})`
            );
          }
        }
      },
      [isCreating, formData.name, formData.symbol, saveTokenToDatabase]
    ),
  });

  const handleInputChange = (
    field: string,
    value: string | number | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    document.getElementById("image")?.click();
  };

  const handleCreateToken = async () => {
    if (!creator) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet.",
      });
      return;
    }

    if (!formData.name || !formData.symbol) {
      toast.error(" Missing Information", {
        description: "Please fill in token name and symbol",
      });
      return;
    }

    setIsCreating(true);
    setCreatedTokenAddress(null);

    try {
      setCurrentStep(2);

      const tokenURI = await uploadTokenMetadata(formData);

      tokenURIRef.current = tokenURI;

      setCurrentStep(3);
      toast.info(" Creating token...", {
        description: "Please wait...",
      });

      const initialPurchaseValue = parseFloat(formData.initialPurchase || "0");

      const totalEth = (
        0.00001 + (initialPurchaseValue > 0 ? initialPurchaseValue : 0)
      ).toString();

      await createToken(formData.name, formData.symbol, tokenURI, totalEth);

      toast(" Transaction Sent!", {
        description: "Waiting for confirmation...",
      });
    } catch (error: unknown) {
      console.error("Token creation error:", error);

      toast.error(" Creation Failed ");

      setIsCreating(false);
      setCurrentStep(1);
    }
  };

  return {
    currentStep,
    isCreating,
    formData,
    previewImage,
    createdTokenAddress,
    handleInputChange,
    handleImageUpload,
    handleAvatarClick,
    handleCreateToken,
  };
}
