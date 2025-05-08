"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, BarChart, Users } from "lucide-react";

interface NFTCardProps {
  hasNFT: boolean;
  onMint: () => void;
}

export function NFTCard({ hasNFT, onMint }: NFTCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle>Access Pass NFT</CardTitle>
        <CardDescription>
          {hasNFT 
            ? "Your key to participating in exclusive token launches" 
            : "Mint your access pass to join token launches"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <div className="relative w-72 h-72 shrink-0">
            {hasNFT ? (
              <div
                className="w-full h-full rounded-2xl overflow-hidden border-2 border-white/10 relative"
              >
                {/* NFT Preview with gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold font-sora mb-2">Launchpad Access Pass</h3>
                  <div className="text-sm text-muted-foreground mb-4">ID: #1234</div>
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <Users className="h-4 w-4" />
                    <span>Owner: You</span>
                  </div>
                  <div className="py-2 px-4 bg-white/10 rounded-full text-sm">
                    Collection: Launchpad Access
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                    <BarChart className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Preview</h3>
                  <p className="text-sm text-muted-foreground">
                    Mint your access pass to view
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">
                {hasNFT ? "Your Access Pass" : "Mint Details"}
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-muted-foreground">Status</span>
                  <span className={`flex items-center gap-1 ${hasNFT ? 'text-green-500' : 'text-amber-500'}`}>
                    {hasNFT ? (
                      <>
                        <CheckCircle className="h-4 w-4" /> Owned
                      </>
                    ) : (
                      "Not Minted"
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-muted-foreground">Price</span>
                  <span>Free</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-muted-foreground">Supply Left</span>
                  <span>{hasNFT ? "999/1000" : "1000/1000"}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-muted-foreground">Utility</span>
                  <span>Launch Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 px-6 py-4">
        {hasNFT ? (
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center text-green-500 font-medium">
              <CheckCircle className="mr-2 h-5 w-5" />
              Access Pass Owned
            </div>
            <Button variant="outline" disabled>
              Already Minted
            </Button>
          </div>
        ) : (
          <div className="w-full flex justify-between items-center">
            <div className="text-muted-foreground">
              Mint your Access Pass to join token launches
            </div>
            <Button variant="gradient" onClick={onMint}>Mint Now</Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
} 