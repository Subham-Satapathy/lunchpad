"use client";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useWallet } from "@/contexts/wallet-context";
import { TokenService } from "@/services/token-service";
import { toast } from "sonner";
import { TransactionConfirmation } from "@/components/launch/transaction-confirmation";

interface SwapFormProps {
  onSubmit: (amount: number) => void;
}

export function SwapForm({ onSubmit }: SwapFormProps) {
  const [amount, setAmount] = useState<number>(0.00001);
  const [tokens, setTokens] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<{
    success: boolean;
    amount: number;
    tokens: number;
    signature: string;
  } | null>(null);
  const { isConnected, smartWalletAuthorityPubkey, signMessage } = useWallet();
  
  // Calculate tokens whenever amount changes
  useEffect(() => {
    // Token price is 0.0001 SOL
    const tokenAmount = amount / 0.0001;
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
    setAmount(0.0005); // Max amount in SOL
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount < 0.00001 || amount > 0.0005) return;

    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      setIsLoading(true);
      
      const tokenService = TokenService.create({
        isConnected,
        smartWalletAuthorityPubkey,
        signMessage,
      });

      const result = await tokenService.mintTokensAfterPayment(amount, tokens);
      
      if (result.success && result.mintSig) {
        toast.success("Successfully minted tokens!");
        setTransactionDetails({
          success: true,
          amount,
          tokens,
          signature: result.mintSig
        });
        setShowConfirmation(true);
        onSubmit(amount);
      } else {
        throw new Error(result.error || "Failed to mint tokens");
      }
    } catch (error) {
      console.error('Error minting tokens:', error);
      toast.error(error instanceof Error ? error.message : "Failed to mint tokens");
      setTransactionDetails({
        success: false,
        amount,
        tokens,
        signature: ''
      });
      setShowConfirmation(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check if amount is valid
  const isValid = amount >= 0.00001 && amount <= 0.0005;
  
  return (
    <>
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
              min={0.00001}
              max={0.0005}
              step={0.00001}
              disabled={isLoading}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 font-medium text-sm">
              SOL
            </div>
          </div>
          
          {/* Slider */}
          <input
            type="range"
            min={0.00001}
            max={0.0005}
            value={amount}
            onChange={handleSliderChange}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-muted"
            disabled={isLoading}
            step={0.00001}
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0.00001 SOL</span>
            <span>0.0005 SOL</span>
          </div>
          
          {/* Error message */}
          {!isValid && (
            <div className="text-red-500 text-sm">
              {amount < 0.00001 ? "Amount must be at least 0.00001 SOL" : "Amount cannot exceed 0.0005 SOL"}
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
            <span>{formatCurrency(amount, "SOL")}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">You receive</span>
            <span>{tokens.toFixed(2)} XYZ</span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Rate</span>
            <span>1 XYZ = {formatCurrency(0.0001, "SOL")}</span>
          </div>
        </div>
        
        {/* Submit button */}
        <Button
          type="submit"
          variant="gradient"
          className="w-full"
          disabled={!isValid || isLoading}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              <span>Processing...</span>
            </div>
          ) : (
            <>
              <span>Swap</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {showConfirmation && transactionDetails && (
        <TransactionConfirmation
          details={transactionDetails}
          onClose={() => setShowConfirmation(false)}
        />
      )}
    </>
  );
} 