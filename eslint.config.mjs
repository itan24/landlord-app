import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

/**
 * ESLint Configuration
 * 
 * Flat config format for ESLint with Next.js and TypeScript support.
 * Uses the new ESLint flat config system for better performance and configuration.
 */

// Get current file directory for flat config compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize flat config compatibility layer
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/**
 * ESLint Configuration Array
 * 
 * Extends Next.js core web vitals and TypeScript rules
 * for optimal code quality and performance.
 */
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
