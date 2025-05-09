"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface TransactionConfirmationProps {
  details: {
    success: boolean;
    amount: number;
    tokens: number;
    signature: string;
  };
  onClose: () => void;
}

export function TransactionConfirmation({ details, onClose }: TransactionConfirmationProps) {
  const { success, amount, tokens, signature } = details;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {success ? "Transaction Successful" : "Transaction Failed"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          {/* Status Icon */}
          <div className={`rounded-full p-3 ${success ? "bg-green-100" : "bg-red-100"}`}>
            {success ? (
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            ) : (
              <XCircle className="h-8 w-8 text-red-600" />
            )}
          </div>

          {/* Transaction Details */}
          <div className="w-full space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Amount Paid</span>
              <span>{formatCurrency(amount, "USDC")}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Tokens Received</span>
              <span>{tokens.toFixed(2)} XYZ</span>
            </div>
            {signature && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Transaction</span>
                <a
                  href={`https://explorer.solana.com/tx/${signature}/?cluster=custom&customUrl=https%3A%2F%2Frpc.lazorkit.xyz`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 flex items-center"
                >
                  <span className="mr-1">View on Explorer</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>

          {/* Close Button */}
          <Button
            variant="gradient"
            className="w-full mt-4"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 