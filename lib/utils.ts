import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToAscii(inputString: string): string {
  // Replace non-ASCII characters and normalize
  return inputString
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .toLowerCase()
    .trim()
}

/**
 * Truncates text to a specified maximum length
 */
export function truncateText(text: string, maxLength = 3000): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength)
}
