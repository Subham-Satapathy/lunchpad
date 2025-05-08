"use client";

import { Button } from "@/components/ui/button";
import { formatCurrency, toggleModal } from "@/lib/utils";
import { Check, X, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

interface TransactionDetails {
  success: boolean;
  amount: number;
  tokens: number;
}

interface TransactionConfirmationProps {
  details: TransactionDetails;
  onClose: () => void;
}

export function TransactionConfirmation({ details, onClose }: TransactionConfirmationProps) {
  const { success, amount, tokens } = details;
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Mock transaction hash
  const txHash = "2xPsuS7fFtz84b5JkAX1AuSUBMWjv5USE7D8z6K8CvWj";
  
  // Control modal visibility with CSS classes
  useEffect(() => {
    // Show modal when component mounts
    toggleModal(modalRef.current, true);
    
    // Handle escape key to close the modal
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);
  
  // Handle closing with animation
  const handleClose = () => {
    toggleModal(modalRef.current, false);
    
    // Wait for animation to complete before unmounting
    setTimeout(() => {
      onClose();
    }, 300);
  };
  
  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 items-center justify-center p-4 hidden modal-overlay"
    >
      <div
        className="bg-card w-full max-w-md rounded-2xl shadow-lg border overflow-hidden modal-content"
      >
        {/* Header */}
        <div className="relative p-6 pb-0">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
          <h2 className="text-xl font-sora font-semibold">Transaction {success ? 'Successful' : 'Failed'}</h2>
          <p className="text-muted-foreground mt-1">Your token purchase is complete</p>
        </div>
        
        {/* Transaction Details */}
        <div className="p-6">
          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            <div className={`rounded-full p-4 ${success ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
              {success ? (
                <Check className="h-10 w-10 text-green-500" />
              ) : (
                <X className="h-10 w-10 text-red-500" />
              )}
            </div>
          </div>
          
          {/* Transaction Info */}
          <div className="space-y-4 mb-6">
            <div className="bg-muted/50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-medium">{formatCurrency(amount, "USDC")}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tokens Received</span>
                <span className="font-medium">{tokens.toFixed(2)} XYZ</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Transaction Hash</span>
                <div className="flex items-center">
                  <span className="text-sm truncate w-24">
                    {txHash.slice(0, 6)}...{txHash.slice(-4)}
                  </span>
                  <Link
                    href={`https://solana.fm/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-blue-500 hover:text-blue-600"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span className="sr-only">View on Explorer</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col space-y-2">
            <Button variant="gradient" onClick={handleClose}>
              Done
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  Back to Dashboard
                </Link>
              </Button>
              
              <Button variant="outline" asChild>
                <Link href="https://solana.fm/tx/${txHash}" target="_blank" rel="noopener noreferrer">
                  View on Explorer
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 