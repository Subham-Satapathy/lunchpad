"use client";

import { RootLayout } from "@/components/layout/root-layout";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SwapForm } from "@/components/launch/swap-form";
import { LaunchStats } from "@/components/launch/launch-stats";
import { useState } from "react";
import { TransactionConfirmation } from "@/components/launch/transaction-confirmation";

export default function LaunchPage() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState({
    success: false,
    amount: 0,
    tokens: 0,
  });

  // Handler for swap submission
  const handleSwapSubmit = (amount: number) => {
    // Calculate token amount (price is 0.05 USDC per token)
    const tokenAmount = amount / 0.05;
    
    // In a real app, this would call to make the transaction
    // For this demo, we'll simulate a successful transaction
    setTransactionDetails({
      success: true,
      amount: amount,
      tokens: tokenAmount,
    });
    
    // Show the confirmation modal
    setShowConfirmation(true);
  };

  return (
    <RootLayout initialLoggedIn={true}>
      <Container className="py-12">
        <div>
          <h1 className="text-3xl font-bold font-sora mb-2">XYZ Token Launch</h1>
          <p className="text-muted-foreground mb-8">
            Participate in the XYZ token launch exclusively with your Access Pass
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Launch Stats - Left Column */}
          <div 
            className="lg:col-span-4"
          >
            <LaunchStats />
          </div>
          
          {/* Swap Interface - Right Column */}
          <div 
            className="lg:col-span-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Swap USDC for XYZ</CardTitle>
                <CardDescription>Participate in the token launch</CardDescription>
              </CardHeader>
              <CardContent>
                <SwapForm onSubmit={handleSwapSubmit} />
              </CardContent>
              <CardFooter className="bg-muted/30 px-6 py-4 flex flex-col items-start">
                <div className="text-sm text-muted-foreground mb-2">
                  • Minimum purchase: 10 USDC
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  • Maximum purchase: 5,000 USDC
                </div>
                <div className="text-sm text-muted-foreground">
                  • Token price: 0.05 USDC per XYZ
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </Container>
      
      {/* Transaction Confirmation Modal */}
      {showConfirmation && (
        <TransactionConfirmation
          details={transactionDetails}
          onClose={() => setShowConfirmation(false)}
        />
      )}
    </RootLayout>
  );
} 