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

  // Handle stored pubkey
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedPubkey = sessionStorage.getItem('smartWalletAuthorityPubkey');
    if (savedPubkey) setStoredSmartWalletPubkey(savedPubkey);
  }, []);

  // Update stored pubkey
  useEffect(() => {
    if (typeof window === 'undefined' || !smartWalletAuthorityPubkey) return;
    sessionStorage.setItem('smartWalletAuthorityPubkey', smartWalletAuthorityPubkey);
    setStoredSmartWalletPubkey(smartWalletAuthorityPubkey);
  }, [smartWalletAuthorityPubkey]);

  // Format error message
  const formatErrorMessage = (error: string | null): string | null => {
    if (!error) return null;
    if (error.includes('Pop up closed unexpectedly')) {
      return null; // Suppress this error entirely
    }
    return error;
  };

  const value = {
    isConnected,
    isLoading,
    error: formatErrorMessage(error),
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