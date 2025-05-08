'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@lazorkit/wallet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Wallet, LogOut } from 'lucide-react';

// Helper function to format wallet address
const formatWalletAddress = (address: string | null): string => {
  if (!address) return '';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

// Client-side wallet component
function WalletComponent() {
  const [storedSmartWalletPubkey, setStoredSmartWalletPubkey] = useState<string | null>(null);
  const {
    connect,
    disconnect,
    isConnected,
    isLoading,
    error,
    smartWalletAuthorityPubkey,
  } = useWallet();

  // Helper function to format error message
  const formatErrorMessage = (error: string | null): string | null => {
    if (!error) return null;
    if (error.includes('Pop up closed unexpectedly')) {
      return null; // Suppress this error entirely
    }
    return error;
  };

  // Log wallet state changes
  useEffect(() => {
    console.log('Wallet State:', {
      isConnected,
      isLoading,
      error,
      smartWalletAuthorityPubkey,
      storedSmartWalletPubkey
    });
  }, [isConnected, isLoading, error, smartWalletAuthorityPubkey, storedSmartWalletPubkey]);

  // Handle stored pubkey
  useEffect(() => {
    const savedPubkey = sessionStorage.getItem('smartWalletAuthorityPubkey');
    console.log('Retrieved from sessionStorage:', savedPubkey);
    if (savedPubkey) setStoredSmartWalletPubkey(savedPubkey);
  }, []);

  // Update stored pubkey
  useEffect(() => {
    if (smartWalletAuthorityPubkey) {
      console.log('New wallet pubkey:', smartWalletAuthorityPubkey);
      sessionStorage.setItem('smartWalletAuthorityPubkey', smartWalletAuthorityPubkey);
      setStoredSmartWalletPubkey(smartWalletAuthorityPubkey);
    }
  }, [smartWalletAuthorityPubkey]);

  return (
    <div className="relative flex items-center justify-center min-h-[80px] w-full">
      {!isConnected ? (
        <Button
          variant="gradient"
          size="sm"
          onClick={connect}
          className="group px-4 py-2 text-base font-medium rounded-lg shadow"
        >
          <Wallet className="mr-2 h-4 w-4" />
          <span>Connect</span>
        </Button>
      ) : (
        <Card className="p-2 bg-muted/30 border-border">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">
                {formatWalletAddress(storedSmartWalletPubkey || smartWalletAuthorityPubkey)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={disconnect}
              className="h-8 w-8 p-0"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Disconnect</span>
            </Button>
          </div>
        </Card>
      )}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
        </div>
      )}
      {error && formatErrorMessage(error) && (
        <p className="text-sm text-destructive mt-2">{formatErrorMessage(error)}</p>
      )}
    </div>
  );
}

// Main component with client-side check
export default function WalletConnector() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <WalletComponent />;
}
