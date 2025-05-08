"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import WalletConnector from "@/components/wallet/wallet-connector";

interface NavbarProps {
  isLoggedIn?: boolean;
}

export function Navbar({ isLoggedIn = false }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="py-4 border-b sticky top-0 backdrop-blur-lg bg-background/70 z-50 w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-sora font-bold text-xl">Launchpad</span>
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
            <div className="ml-6">
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