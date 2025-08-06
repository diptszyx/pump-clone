"use client";
import { useAccount, useDisconnect, useBalance } from "wagmi";
import { Button } from "@/src/components/ui/8bit/button";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { type Address } from "viem";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Copy, LogOut, Wallet, CheckCircle2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address: address as Address | undefined,
  });
  const { open } = useWeb3Modal();
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success(
        `${address.slice(0, 8)}...${address.slice(-6)} copied to clipboard`
      );

      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openExplorer = () => {
    if (address) {
      window.open(`https://etherscan.io/address/${address}`, "_blank");
    }
  };

  if (!mounted) {
    return (
      <Button
        variant="neon"
        font="retro"
        className="bg-gray-600 text-white hover:bg-gray-500"
      >
        <div className="w-4 h-4 animate-pulse bg-gray-400 rounded-full mr-2" />
        Loading...
      </Button>
    );
  }
  if (!isConnected) {
    return (
      <Button
        onClick={() => open()}
        variant="neon"
        font="retro"
        className="bg-emerald-600 text-white hover:bg-emerald-500 px-4 py-2 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="neon"
          font="retro"
          className="bg-gray-700 text-white hover:bg-gray-600 px-3 py-2 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-gray-800 border-gray-700 text-white"
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
          <span className="font-medium">Your Wallet</span>
          <span className="text-sm text-gray-300">
            {balance?.formatted.slice(0, 6)} {balance?.symbol}
          </span>
        </div>

        <DropdownMenuItem
          onClick={handleCopyAddress}
          className="flex cursor-pointer items-center gap-2 py-3 text-sm hover:bg-gray-700"
        >
          {copied ? (
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          Copy address
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={openExplorer}
          className="flex cursor-pointer items-center gap-2 py-3 text-sm hover:bg-gray-700"
        >
          <ExternalLink className="w-4 h-4" />
          View on Etherscan
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-700" />

        <DropdownMenuItem
          onClick={() => disconnect()}
          className="flex cursor-pointer items-center gap-2 py-3 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300"
        >
          <LogOut className="w-4 h-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
