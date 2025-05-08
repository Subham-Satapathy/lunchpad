"use client";

import { RootLayout } from "@/components/layout/root-layout";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <RootLayout>
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <Container>
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold font-sora leading-tight mb-6"
              >
                Launch Without <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Wallets</span>
              </h1>
              <p
                className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0"
              >
                The simplest way to participate in token launches. Log in with a Passkey, mint your Access NFT, and join launches without ever creating a wallet.
              </p>
              <div>
                <Link href="/dashboard">
                  <Button
                    variant="gradient"
                    size="xl"
                    className="group"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <span>Launch App</span>
                    <ArrowRight className={`ml-2 transition-all duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex-1 relative">
              <div
                className="relative h-[500px] md:h-[600px] w-full flex items-center justify-center"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-72 h-72 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 blur-3xl" />
                </div>

                {/* Flow Illustration */}
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className="rounded-2xl bg-white/5 border border-white/10 shadow-xl backdrop-blur-lg p-6 mb-8"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">1</div>
                      <h3 className="font-medium text-lg">Passkey Login</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Secure login without passwords or seed phrases</p>
                  </div>

                  <div
                    className="rounded-2xl bg-white/5 border border-white/10 shadow-xl backdrop-blur-lg p-6 mb-8"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">2</div>
                      <h3 className="font-medium text-lg">Mint Access NFT</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Get your exclusive pass to token launches</p>
                  </div>

                  <div
                    className="rounded-2xl bg-white/5 border border-white/10 shadow-xl backdrop-blur-lg p-6"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">3</div>
                      <h3 className="font-medium text-lg">Join Token Launches</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Participate in launches with a seamless experience</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-sora mb-4">Why Use Launchpad?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">The future of token launches is simple, secure, and accessible.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-2xl bg-card border p-6">
              <CheckCircle className="h-10 w-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Wallet Needed</h3>
              <p className="text-muted-foreground">Login with a passkey - no browser extensions, seed phrases, or gas management required.</p>
            </div>

            <div className="rounded-2xl bg-card border p-6">
              <CheckCircle className="h-10 w-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Exclusive Access</h3>
              <p className="text-muted-foreground">Your Access NFT is your ticket to participate in the most promising token launches.</p>
            </div>

            <div className="rounded-2xl bg-card border p-6">
              <CheckCircle className="h-10 w-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Seamless Experience</h3>
              <p className="text-muted-foreground">A modern, intuitive interface that makes participating in DeFi as easy as using any Web2 app.</p>
            </div>
          </div>
        </Container>
      </section>
    </RootLayout>
  );
}
