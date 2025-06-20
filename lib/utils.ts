import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes
 * 
 * Combines clsx and tailwind-merge to handle class name conflicts
 * and conditional classes efficiently. This is particularly useful
 * for merging Tailwind classes without conflicts.
 * 
 * @param inputs - Array of class values (strings, objects, arrays, etc.)
 * @returns Merged class string with resolved conflicts
 * 
 * @example
 * ```tsx
 * cn("px-2 py-1", "px-4", { "bg-blue-500": true, "text-white": false })
 * // Returns: "py-1 px-4 bg-blue-500"
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
