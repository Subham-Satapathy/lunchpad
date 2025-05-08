"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { truncateAddress } from "@/lib/utils";
import { Copy, CheckCircle, Key } from "lucide-react";
import { useState } from "react";

export function UserInfoCard() {
  const [copied, setCopied] = useState(false);
  
  // Demo wallet address for display
  const walletAddress = "8zJB5NKDh49VDUSvqjafnANRfm67xZwdwDXtC9YJgiMM";
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Account</CardTitle>
        <CardDescription>Your passkey-associated wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">PDA</h3>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-muted rounded-md flex-grow flex items-center">
                <Key className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
                <span className="text-sm font-mono truncate">
                  {truncateAddress(walletAddress, 6, 6)}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="shrink-0"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <span className="text-muted-foreground">Status</span>
              <span className="flex items-center text-green-500">
                <CheckCircle className="h-4 w-4 mr-1" /> Connected
              </span>
            </div>
            
            <div className="flex justify-between items-center border-b border-border pb-2">
              <span className="text-muted-foreground">Authentication</span>
              <span>Passkey</span>
            </div>
            
            <div className="flex justify-between items-center border-b border-border pb-2">
              <span className="text-muted-foreground">Account Type</span>
              <span>Standard</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 px-6 py-4">
        <Button variant="outline" className="w-full" disabled>
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  );
} 