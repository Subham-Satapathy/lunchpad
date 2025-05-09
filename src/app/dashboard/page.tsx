"use client";

import { RootLayout } from "@/components/layout/root-layout";
import { Container } from "@/components/ui/container";
import { NFTCard } from "@/components/dashboard/nft-card";
import { LaunchCard } from "@/components/dashboard/launch-card";
import { useState, useEffect } from "react";
import { useWallet } from '@lazorkit/wallet';
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  const { isConnected, smartWalletAuthorityPubkey } = useWallet();
  const [hasNFT, setHasNFT] = useState(false);
  
  // Check if user has NFT based on wallet connection
  useEffect(() => {
    if (isConnected && smartWalletAuthorityPubkey) {
      // TODO: Add actual NFT check logic here
      setHasNFT(true);
    } else {
      setHasNFT(false);
    }
  }, [isConnected, smartWalletAuthorityPubkey]);

  // Handle minting with actual wallet
  const handleMint = async () => {
    if (!isConnected) {
      // TODO: Show error message or redirect to connect wallet
      return;
    }
    
    try {
      // TODO: Add actual minting logic here
      setHasNFT(true);
    } catch (error) {
      console.error('Error minting NFT:', error);
      // TODO: Show error message to user
    }
  };

  return (
    <RootLayout initialLoggedIn={true}>
      <Container className="py-8 md:py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-sora mb-4">
            Welcome to LaunchPad
          </h1>
          <p className="text-lg text-muted-foreground">
            Your gateway to exclusive token launches
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Access Status</h3>
            <p className="text-2xl font-bold">{hasNFT ? 'Active' : 'Inactive'}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Wallet Status</h3>
            <p className="text-2xl font-bold">{isConnected ? 'Connected' : 'Disconnected'}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Next Launch</h3>
            <p className="text-2xl font-bold">Coming Soon</p>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* NFT Card */}
            <div className="bg-card rounded-lg shadow-sm">
              <NFTCard hasNFT={hasNFT} onMint={handleMint} />
            </div>
            
            {/* Upcoming Launch Card */}
            <div className="bg-card rounded-lg shadow-sm">
              <LaunchCard isActive={hasNFT} />
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-4">
                <button className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                  View All Launches
                </button>
                <button className="w-full py-2 px-4 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors">
                  My Portfolio
                </button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">No recent activity</p>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </RootLayout>
  );
} 