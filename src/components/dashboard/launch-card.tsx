"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Clock, ArrowRight, LockIcon } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface LaunchCardProps {
  isActive: boolean;
}

export function LaunchCard({ isActive }: LaunchCardProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  
  useEffect(() => {
    // Set target date to 3 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format time units to always show two digits
  const formatTimeUnit = (unit: number) => {
    return unit.toString().padStart(2, '0');
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Upcoming Launch</CardTitle>
        <CardDescription>Next token launch details</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Project XYZ Token</h3>
              <p className="text-sm text-muted-foreground mb-4">
                The XYZ platform is a decentralized solution for cross-chain swaps with low fees and high security.
              </p>
              <div className="flex items-center text-amber-500 mb-6">
                <Clock className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Launch Countdown</span>
              </div>
              
              {/* Countdown Timer */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="bg-muted rounded-lg p-3 text-center">
                  <div className="text-xl font-bold">{formatTimeUnit(timeLeft.days)}</div>
                  <div className="text-xs text-muted-foreground">Days</div>
                </div>
                <div className="bg-muted rounded-lg p-3 text-center">
                  <div className="text-xl font-bold">{formatTimeUnit(timeLeft.hours)}</div>
                  <div className="text-xs text-muted-foreground">Hours</div>
                </div>
                <div className="bg-muted rounded-lg p-3 text-center">
                  <div className="text-xl font-bold">{formatTimeUnit(timeLeft.minutes)}</div>
                  <div className="text-xs text-muted-foreground">Minutes</div>
                </div>
                <div className="bg-muted rounded-lg p-3 text-center">
                  <div className="text-xl font-bold">{formatTimeUnit(timeLeft.seconds)}</div>
                  <div className="text-xs text-muted-foreground">Seconds</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-muted-foreground">Token Price</span>
                <span>{formatCurrency(0.05, "USDC")}</span>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-muted-foreground">Tokens Available</span>
                <span>1,000,000 XYZ</span>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-muted-foreground">Min Purchase</span>
                <span>{formatCurrency(10, "USDC")}</span>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-muted-foreground">Max Purchase</span>
                <span>{formatCurrency(5000, "USDC")}</span>
              </div>
            </div>
          </div>
          
          <div className="md:w-64 shrink-0">
            <div className="h-full flex flex-col justify-between">
              <div className="rounded-2xl bg-muted p-4 h-32 flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="font-sora font-bold text-2xl mb-1">XYZ</div>
                  <div className="text-sm text-muted-foreground">Token</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <span className="py-1 px-2 bg-amber-500/10 text-amber-500 rounded-full text-xs">
                    Coming Soon
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Access</span>
                  <span className={isActive ? "text-green-500" : "text-red-500"}>
                    {isActive ? "Granted" : "Restricted"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 px-6 py-4">
        {isActive ? (
          <Button variant="gradient" className="w-full" asChild>
            <Link href="/launch">
              <span>View Launch</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button variant="outline" className="w-full" disabled>
            <LockIcon className="mr-2 h-4 w-4" />
            <span>Mint Access Pass First</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 