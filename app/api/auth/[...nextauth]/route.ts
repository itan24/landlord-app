import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * NextAuth API Route Handler
 * 
 * Handles all NextAuth.js authentication requests including:
 * - Sign in/out
 * - Session management
 * - OAuth callbacks
 * - JWT token handling
 * 
 * Uses the authOptions configuration from lib/auth.ts
 */
const handler = NextAuth(authOptions);

// Export handler for both GET and POST requests
export { handler as GET, handler as POST };