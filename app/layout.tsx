import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeToggleProvider } from "@/components/ThemeToggleProvider";
import { Navigation } from "@/components/ui/Navigation";
import { ClientSessionProvider } from "../components/ClientSessionProvider";

// Font configuration for the application
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Application metadata for SEO and browser display
export const metadata: Metadata = {
  title: "Landlord App",
  description: "Manage tenants and bills",
};

/**
 * RootLayout Component
 * 
 * Main layout wrapper for the entire application that provides:
 * - Font configuration (Geist Sans and Mono)
 * - Theme toggle functionality
 * - Navigation component
 * - Session management
 * - Global styling
 * 
 * @param children - React components to be rendered within the layout
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Session management provider for authentication */}
        <ClientSessionProvider>
          {/* Theme toggle provider for dark/light mode */}
          <ThemeToggleProvider>
            {/* Global navigation component */}
            <Navigation />
            {/* Main content area */}
            {children}
          </ThemeToggleProvider>
        </ClientSessionProvider>
      </body>
    </html>
  );
}
