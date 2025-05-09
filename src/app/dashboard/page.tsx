"use client";

import { RootLayout } from "@/components/layout/root-layout";
import { Container } from "@/components/ui/container";
import { NFTCard } from "@/components/dashboard/nft-card";
import { LaunchCard } from "@/components/dashboard/launch-card";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { NFTService } from "@/services/nft-service";
import { toast } from "sonner";
import { useWallet } from "@/contexts/wallet-context";

export default function Dashboard() {
  const {
    isConnected,
    smartWalletAuthorityPubkey,
    signMessage,
    signTransaction
  } = useWallet();
  const [hasNFT, setHasNFT] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintError, setMintError] = useState<string | null>(null);
  
  // Check if user has NFT based on wallet connection
  useEffect(() => {
    const checkNFTOwnership = async () => {
      if (isConnected && smartWalletAuthorityPubkey) {
        try {
          // TODO: Implement NFT discovery to find user's access pass
          setHasNFT(false);
        } catch (error) {
          console.error('Error checking NFT ownership:', error);
          setHasNFT(false);
        }
      } else {
        setHasNFT(false);
      }
    };

    checkNFTOwnership();
  }, [isConnected, smartWalletAuthorityPubkey, signMessage, signTransaction]);

  // Handle minting with actual wallet
  const handleMint = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!smartWalletAuthorityPubkey) {
      toast.error("Smart wallet authority not found");
      return;
    }
    
    try {
      setIsMinting(true);
      setMintError(null);
      
      const nftService = NFTService.create({ 
        isConnected, 
        smartWalletAuthorityPubkey,
        signMessage,
        signTransaction
      });

      // Sign a message to verify ownership
      const signResult = await nftService.signMessage("I am minting a LaunchPad Access Pass NFT");
      if (!signResult.success) {
        throw new Error("Failed to sign message");
      }
      
      // Directly assign NFT after signature verification
      setHasNFT(true);
      toast.success("Successfully assigned Access Pass NFT!");
    } catch (error) {
      console.error('Error minting NFT:', error);
      setMintError(error instanceof Error ? error.message : "Failed to mint NFT");
      toast.error("Failed to mint NFT. Please try again.");
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <RootLayout>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <NFTCard
            hasNFT={hasNFT}
            onMint={handleMint}
            isMinting={isMinting}
            mintError={mintError}
          />
          <LaunchCard isActive={hasNFT} />
        </div>
      </Container>
    </RootLayout>
  );
} 