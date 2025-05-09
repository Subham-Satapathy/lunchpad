'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useWallet as useLazorWallet } from '@lazorkit/wallet';
import { TransactionInstruction, Transaction } from '@solana/web3.js';
import dynamic from 'next/dynamic';

// Extend Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (eventName: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (eventName: string, handler: (...args: unknown[]) => void) => void;
      isMetaMask?: boolean;
      selectedAddress?: string | null;
      networkVersion?: string;
    };
  }
}

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
    }, 100); // Small delay to prevent flash

    return () => clearTimeout(timer);
  }, [error]);

  // Prevent conflicts with other wallet providers
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check if ethereum property exists and is writable
    const ethereumDescriptor = Object.getOwnPropertyDescriptor(window, 'ethereum');
    if (!ethereumDescriptor) return;
    
    // Only store and restore if the property is writable
    if (ethereumDescriptor.writable && ethereumDescriptor.configurable) {
      const originalEthereum = window.ethereum;
      
      // Clean up function
      return () => {
        if (originalEthereum) {
          try {
            Object.defineProperty(window, 'ethereum', {
              value: originalEthereum,
              writable: true,
              configurable: true
            });
          } catch (error) {
            console.warn('Could not restore ethereum property:', error);
          }
        }
      };
    }
  }, []);

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