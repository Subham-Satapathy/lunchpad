'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useWallet as useLazorWallet } from '@lazorkit/wallet';
import { TransactionInstruction, Transaction } from '@solana/web3.js';
import dynamic from 'next/dynamic';

// Types
interface WalletState {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  smartWalletAuthorityPubkey: string | null;
}

interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  formatAddress: (address: string | null) => string;
  signMessage: (instruction: TransactionInstruction) => Promise<string>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
}

// Create context with default values
const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  isLoading: false,
  error: null,
  smartWalletAuthorityPubkey: null,
  connect: async () => {},
  disconnect: async () => {},
  formatAddress: () => '',
  signMessage: async () => '',
  signTransaction: async (transaction) => transaction,
});

// Helper function to format wallet address
const formatWalletAddress = (address: string | null): string => {
  if (!address) return '';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

// Provider component
function WalletProviderComponent({ children }: { children: ReactNode }) {
  const [storedSmartWalletPubkey, setStoredSmartWalletPubkey] = useState<string | null>(null);
  const [debouncedError, setDebouncedError] = useState<string | null>(null);
  
  const {
    connect: lazorConnect,
    disconnect: lazorDisconnect,
    isConnected,
    isLoading,
    error,
    smartWalletAuthorityPubkey,
    signMessage: lazorSignMessage,
    signTransaction: lazorSignTransaction,
  } = useLazorWallet();

  // Debounce error updates
  useEffect(() => {
    if (!error) {
      setDebouncedError(null);
      return;
    }

    if (error.includes('Pop up closed unexpectedly')) {
      setDebouncedError(null);
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedError(error);
    }, 100);

    return () => clearTimeout(timer);
  }, [error]);

  // Handle stored pubkey
  useEffect(() => {
    const savedPubkey = sessionStorage.getItem('smartWalletAuthorityPubkey');
    if (savedPubkey) setStoredSmartWalletPubkey(savedPubkey);
  }, []);

  // Update stored pubkey
  useEffect(() => {
    if (!smartWalletAuthorityPubkey) return;
    sessionStorage.setItem('smartWalletAuthorityPubkey', smartWalletAuthorityPubkey);
    setStoredSmartWalletPubkey(smartWalletAuthorityPubkey);
  }, [smartWalletAuthorityPubkey]);

  const value = {
    isConnected,
    isLoading,
    error: debouncedError,
    smartWalletAuthorityPubkey: storedSmartWalletPubkey || smartWalletAuthorityPubkey,
    connect: lazorConnect,
    disconnect: lazorDisconnect,
    formatAddress: formatWalletAddress,
    signMessage: lazorSignMessage,
    signTransaction: lazorSignTransaction,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

// Export a client-side only version of the provider
export const WalletProvider = dynamic(() => Promise.resolve(WalletProviderComponent), {
  ssr: false,
});

// Custom hook to use the wallet context
export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
} 