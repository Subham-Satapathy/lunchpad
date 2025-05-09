"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import WalletConnector from "@/components/wallet/wallet-connector";
import Image from "next/image";
export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="h-16 border-b sticky top-0 backdrop-blur-lg bg-background/70 z-50 w-full flex items-center">
      <div className="px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Logo" width={96} height={96} />
          </Link>
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-6">
              <Link 
                href="/dashboard" 
                className={`text-sm font-medium`}
              >
                Dashboard
              </Link>
              <Link 
                href="/launch" 
                className={`text-sm font-medium`}
              >
                Launches
              </Link>
              <Link 
                href="/dashboard" 
                className={`text-sm font-medium`}
              >
                Your NFTs
              </Link>
            </div>
            <div className="ml-6 min-w-[120px]">
              <WalletConnector />
            </div>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile navigation */}
        {isMobileMenuOpen && (
          <div className="mt-4 pb-4 space-y-4 md:hidden">
            <Link 
              href="/dashboard" 
              className={`block py-2 text-sm font-medium`}
            >
              Dashboard
            </Link>
            <Link 
              href="/launch" 
              className={`block py-2 text-sm font-medium`}
            >
              Launches
            </Link>
            <Link 
              href="/dashboard" 
              className={`block py-2 text-sm font-medium`}
            >
              Your NFTs
            </Link>
            <div className="pt-2">
              <WalletConnector />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 