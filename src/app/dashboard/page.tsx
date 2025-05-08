"use client";

import { RootLayout } from "@/components/layout/root-layout";
import { Container } from "@/components/ui/container";
import { NFTCard } from "@/components/dashboard/nft-card";
import { LaunchCard } from "@/components/dashboard/launch-card";
import { UserInfoCard } from "@/components/dashboard/user-info-card";
import { useState } from "react";

export default function Dashboard() {
  const [hasNFT, setHasNFT] = useState(false);
  
  // For demo purposes, we'll toggle hasNFT when user clicks the mint button
  const handleMint = () => {
    setHasNFT(true);
  };

  return (
    <RootLayout initialLoggedIn={true}>
      <Container className="py-12">
        <h1 
          className="text-3xl font-bold font-sora mb-8"
        >
          Dashboard
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* User Info Card - Left Column */}
          <div 
            className="lg:col-span-4"
          >
            <UserInfoCard />
          </div>
          
          <div className="lg:col-span-8 space-y-8">
            {/* NFT Card */}
            <div>
              <NFTCard hasNFT={hasNFT} onMint={handleMint} />
            </div>
            
            {/* Upcoming Launch Card */}
            <div>
              <LaunchCard isActive={hasNFT} />
            </div>
          </div>
        </div>
      </Container>
    </RootLayout>
  );
} 