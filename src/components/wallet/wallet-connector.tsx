'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Wallet, LogOut } from 'lucide-react';
import { useWallet } from '@/contexts/wallet-context';

// Client-side wallet component
function WalletComponent() {
  const {
    connect,
    disconnect,
    isConnected,
    isLoading,
    error,
    smartWalletAuthorityPubkey,
    formatAddress,
  } = useWallet();

  const handleConnect = async () => {
    try {
      await connect();
    } catch {
      // Error is already handled by the wallet context
      console.log('Connection attempt completed');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-[80px] w-full">
      {!isConnected ? (
        <Button
          variant="gradient"
          size="sm"
          onClick={handleConnect}
          disabled={isLoading}
          className={`group min-w-[120px] text-base font-medium rounded-lg shadow transition-opacity duration-200 ${
            isLoading ? 'opacity-50' : 'opacity-100'
          }`}
        >
          <Wallet className={`mr-2 h-4 w-4 ${isLoading ? 'animate-pulse' : ''}`} />
          <span>{isLoading ? 'Connecting...' : 'Connect'}</span>
        </Button>
      ) : (
        <Card className="p-2 bg-muted/30 border-border">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">
                {formatAddress(smartWalletAuthorityPubkey)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={disconnect}
              disabled={isLoading}
              className={`h-8 w-8 p-0 transition-opacity duration-200 ${
                isLoading ? 'opacity-50' : 'opacity-100'
              }`}
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Disconnect</span>
            </Button>
          </div>
        </Card>
      )}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg transition-opacity duration-200">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
        </div>
      )}
      {error && (
        <p className="text-sm text-destructive mt-2 animate-fade-in">{error}</p>
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
