"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

/**
 * Props interface for ClientSessionProvider
 */
interface ClientSessionProviderProps {
  children: ReactNode;
}

/**
 * ClientSessionProvider Component
 * 
 * Wrapper component that provides NextAuth session management
 * to the client-side components. This enables authentication
 * state management throughout the application.
 * 
 * @param children - React components to be wrapped with session provider
 */
export function ClientSessionProvider({ children }: ClientSessionProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}