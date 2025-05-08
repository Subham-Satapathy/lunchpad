"use client";

import { Container } from "@/components/ui/container";
import Link from "next/link";
import { Twitter, Github, Book } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-8 border-t mt-auto">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Launchpad. All rights reserved.
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <Link
              href="https://docs.example.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Book className="h-5 w-5" />
              <span className="sr-only">Documentation</span>
            </Link>
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
} 