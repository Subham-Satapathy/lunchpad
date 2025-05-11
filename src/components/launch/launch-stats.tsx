"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { BarChart3, Coins, Users, TrendingUp } from "lucide-react";

export function LaunchStats() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Launch Stats</CardTitle>
        <CardDescription>Current token launch metrics</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-8">
          {/* Token Display */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 p-6 text-center backdrop-blur">
            <div className="font-sora font-bold text-3xl mb-1">XYZ</div>
            <div className="text-sm text-muted-foreground mb-4">Project XYZ Token</div>
            <div className="py-1 px-3 bg-green-500/10 text-green-500 rounded-full text-xs inline-block">
              Active
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted rounded-xl p-4">
              <div className="flex items-center mb-2">
                <Coins className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm font-medium">Total Raised</span>
              </div>
              <div className="text-xl font-bold">
                {formatCurrency(42, "SOL")}
              </div>
            </div>
            
            <div className="bg-muted rounded-xl p-4">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm font-medium">Token Price</span>
              </div>
              <div className="text-xl font-bold">
                {formatCurrency(0.00001, "SOL")}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted rounded-xl p-4">
              <div className="flex items-center mb-2">
                <BarChart3 className="h-5 w-5 text-purple-500 mr-2" />
                <span className="text-sm font-medium">Tokens Left</span>
              </div>
              <div className="text-xl font-bold">
                99.1
              </div>
            </div>
            
            <div className="bg-muted rounded-xl p-4">
              <div className="flex items-center mb-2">
                <Users className="h-5 w-5 text-amber-500 mr-2" />
                <span className="text-sm font-medium">Participants</span>
              </div>
              <div className="text-xl font-bold">
                243
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-medium">85%</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" style={{ width: '85%' }} />
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>0 XYZ</span>
              <span>1,000,000 XYZ</span>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="text-muted-foreground">Start Date</span>
              <span>May 5, 2025</span>
            </div>
            
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="text-muted-foreground">End Date</span>
              <span>May 30, 2025</span>
            </div>
            
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="text-muted-foreground">Min Purchase</span>
              <span>{formatCurrency(0.00001, "SOL")}</span>
            </div>
            
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="text-muted-foreground">Max Purchase</span>
              <span>{formatCurrency(0.0005, "SOL")}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 