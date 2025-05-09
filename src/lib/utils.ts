import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and merges them with tailwind-merge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as currency
 */
export function formatCurrency(value: number, currency: string = "USD", decimals: number = 2): string {
  // Use more decimal places for SOL
  if (currency === "SOL") {
    return `${value.toFixed(5)} ${currency}`;
  }
  return `${value.toFixed(decimals)} ${currency}`;
}

/**
 * Truncates a string (like a wallet address) with ellipsis
 */
export function truncateAddress(address: string, startChars = 4, endChars = 4) {
  if (!address) return "";
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Formats a date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Returns a random delay for staggered animations
 */
export function randomDelay(min = 0, max = 0.5): number {
  return Math.random() * (max - min) + min;
}

/**
 * Sleep utility for async functions
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Animation helper for showing/hiding modal with CSS animations
export function toggleModal(modalElement: HTMLElement | null, isVisible: boolean): void {
  if (!modalElement) return;
  
  if (isVisible) {
    // Show modal
    modalElement.classList.remove('hidden');
    modalElement.classList.add('flex');
    // Ensure it gets painted before adding the animation class
    setTimeout(() => {
      modalElement.classList.add('modal-visible');
    }, 10);
  } else {
    // Hide modal
    modalElement.classList.remove('modal-visible');
    // Wait for animation to complete
    setTimeout(() => {
      modalElement.classList.remove('flex');
      modalElement.classList.add('hidden');
    }, 300); // Should match animation duration
  }
} 