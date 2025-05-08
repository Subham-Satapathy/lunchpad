"use client";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

interface SwapFormProps {
  onSubmit: (amount: number) => void;
}

export function SwapForm({ onSubmit }: SwapFormProps) {
  const [amount, setAmount] = useState<number>(10);
  const [tokens, setTokens] = useState<number>(0);
  
  // Calculate tokens whenever amount changes
  useEffect(() => {
    // Token price is 0.05 USDC
    const tokenAmount = amount / 0.05;
    setTokens(tokenAmount);
  }, [amount]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setAmount(value);
    }
  };
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAmount(value);
  };
  
  const handleMaxClick = () => {
    setAmount(5000); // Max amount
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount >= 10 && amount <= 5000) {
      onSubmit(amount);
    }
  };
  
  // Check if amount is valid
  const isValid = amount >= 10 && amount <= 5000;
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Input amount section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label htmlFor="amount" className="text-sm font-medium">
            Input Amount
          </label>
          <button
            type="button"
            onClick={handleMaxClick}
            className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
          >
            MAX
          </button>
        </div>
        
        <div className="relative">
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={handleInputChange}
            className="w-full py-4 px-4 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-blue-500 pr-20"
            min={10}
            max={5000}
            step={1}
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 font-medium text-sm">
            USDC
          </div>
        </div>
        
        {/* Slider */}
        <input
          type="range"
          min={10}
          max={5000}
          value={amount}
          onChange={handleSliderChange}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-muted"
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>10 USDC</span>
          <span>5,000 USDC</span>
        </div>
        
        {/* Error message */}
        {!isValid && (
          <div className="text-red-500 text-sm">
            {amount < 10 ? "Amount must be at least 10 USDC" : "Amount cannot exceed 5,000 USDC"}
          </div>
        )}
      </div>
      
      {/* Arrow */}
      <div className="flex justify-center">
        <div className="bg-muted rounded-full p-2">
          <ArrowDown className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
      
      {/* Output token section */}
      <div className="space-y-4">
        <label htmlFor="tokens" className="text-sm font-medium">
          You Receive
        </label>
        
        <div className="relative">
          <input
            id="tokens"
            type="text"
            value={tokens.toFixed(2)}
            readOnly
            className="w-full py-4 px-4 bg-muted rounded-xl border border-border focus:outline-none pr-20"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 font-medium text-sm">
            XYZ
          </div>
        </div>
      </div>
      
      {/* Transaction preview */}
      <div className="bg-muted/50 rounded-xl p-4 space-y-2">
        <h3 className="text-sm font-medium mb-2">Transaction Preview</h3>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">You pay</span>
          <span>{formatCurrency(amount, "USDC")}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">You receive</span>
          <span>{tokens.toFixed(2)} XYZ</span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Rate</span>
          <span>1 XYZ = {formatCurrency(0.05, "USDC")}</span>
        </div>
      </div>
      
      {/* Submit button */}
      <Button
        type="submit"
        variant="gradient"
        className="w-full"
        disabled={!isValid}
      >
        <span>Swap</span>
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
} 