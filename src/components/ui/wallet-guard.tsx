"use client";

import { ReactNode } from "react";
import { useAccount } from "wagmi";
import { NoSSR } from "./no-ssr";

interface WalletGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
}

export function WalletGuard({
  children,
  fallback = null,
  loadingFallback = null,
}: WalletGuardProps) {
  return (
    <NoSSR fallback={loadingFallback}>
      <WalletGuardInner fallback={fallback}>{children}</WalletGuardInner>
    </NoSSR>
  );
}

function WalletGuardInner({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { isConnected } = useAccount();

  if (!isConnected && fallback) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
