"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { useEffect } from "react";

interface RootLayoutProps {
  children: React.ReactNode;
}

// Extend Window interface to include our custom property
declare global {
  interface Window {
    toggleLogin: () => void;
  }
}

export function RootLayout({ children }: RootLayoutProps) {
  // For demo purposes, we'll provide a function to toggle login state
  const toggleLogin = () => {
    // This is now just a placeholder function for the window object
    console.log('Toggle login called');
  };

  // Expose the login toggle to the window object for demo purposes
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.toggleLogin = toggleLogin;
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
} 