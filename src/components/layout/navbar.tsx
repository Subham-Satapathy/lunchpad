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
            <Image src="/logo.png" alt="Logo" width={96} height={96} className="w-12 h-12 sm:w-16 sm:h-16" />
          </Link>
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-6">
              <Link 
                href="/dashboard" 
                className="text-sm font-medium hover:text-primary transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link 
                href="/launch" 
                className="text-sm font-medium hover:text-primary transition-colors duration-200"
              >
                Launches
              </Link>
              <Link 
                href="/dashboard" 
                className="text-sm font-medium hover:text-primary transition-colors duration-200"
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
            className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile navigation overlay */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu backdrop"
            />
            {/* Menu Panel */}
            <div className="fixed top-16 left-0 w-full z-50 bg-background border-b md:hidden shadow-lg animate-fadeInDown">
              <div className="px-4 pb-4 pt-2 space-y-4">
                <Link 
                  href="/dashboard" 
                  className="block py-2 text-sm font-medium hover:text-primary transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/launch" 
                  className="block py-2 text-sm font-medium hover:text-primary transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Launches
                </Link>
                <Link 
                  href="/dashboard" 
                  className="block py-2 text-sm font-medium hover:text-primary transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Your NFTs
                </Link>
                <div className="pt-2">
                  <WalletConnector />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
} 