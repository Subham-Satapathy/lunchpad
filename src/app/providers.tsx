"use client";

import React, { ReactNode } from "react";
import { WalletProvider } from "@/contexts/wallet-context";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <WalletProvider>
      {children}
    </WalletProvider>
  );
} 