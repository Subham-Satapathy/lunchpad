"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { useState, useEffect } from "react";

interface RootLayoutProps {
  children: React.ReactNode;
  initialLoggedIn?: boolean;
}

export function RootLayout({ 
  children, 
  initialLoggedIn = false 
}: RootLayoutProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(initialLoggedIn);

  // For demo purposes, we'll provide a function to toggle login state
  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  // Expose the login toggle to the window object for demo purposes
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).toggleLogin = toggleLogin;
    }
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
} 