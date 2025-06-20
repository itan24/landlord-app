"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home as HomeIcon, Users, FileText } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";

/**
 * Home Component
 * 
 * Landing page that displays different content based on authentication status.
 * Shows welcome message and navigation options for authenticated users,
 * or sign-in prompt for unauthenticated users.
 * 
 * Features:
 * - Responsive design with animated background
 * - Dynamic content based on authentication state
 * - Smooth animations and hover effects
 * - Professional glassmorphism design
 */
export default function Home() {
  const { data: session, status } = useSession();

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 dark:from-[#181c2b] dark:via-[#232a3d] dark:to-[#1a1f2e] animate-gradient-move px-2 sm:px-4 py-8">
      {/* Enhanced Animated Background */}
      <AnimatedBackground />
      
      {/* Main Content */}
      <div className="relative z-10 text-center animate-fade-in">
        {/* Header Section */}
        <div className="mb-8">
          <HomeIcon className="w-16 h-16 sm:w-20 sm:h-20 text-blue-500 dark:text-blue-300 mx-auto mb-4 animate-bounce" />
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Landlord App
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-200 max-w-2xl mx-auto">
            Professional property management made simple and beautiful.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
          <div className="glass-effect rounded-2xl p-6 hover-lift">
            <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Tenant Management</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Manage all your tenants with detailed profiles and contact information.
            </p>
          </div>
          
          <div className="glass-effect rounded-2xl p-6 hover-lift">
            <FileText className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Bill Tracking</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Track rent, utilities, and custom charges with automated calculations.
            </p>
          </div>
          
          <div className="glass-effect rounded-2xl p-6 hover-lift">
            <HomeIcon className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Property Overview</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get a complete overview of your property portfolio and income.
            </p>
          </div>
        </div>

        {/* Action Section */}
        {status === "loading" ? (
          <div className="glass-effect rounded-2xl p-8 animate-pulse">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        ) : session ? (
          // User is authenticated - show dashboard link
          <div className="glass-effect rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Welcome back, {session.user?.name}!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Ready to manage your properties? Access your dashboard to view tenants and bills.
            </p>
            <Link href="/dashboard">
              <Button 
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 text-lg font-bold rounded-full shadow-lg transition-all duration-200 hover-lift"
              >
                Go to Dashboard
              </Button>
            </Link>
          </div>
        ) : (
          // User is not authenticated - show sign-in button
          <div className="glass-effect rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Get Started Today</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Sign in to start managing your properties with our professional tools.
            </p>
            <Link href="/api/auth/signin">
              <Button 
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 text-lg font-bold rounded-full shadow-lg transition-all duration-200 hover-lift"
              >
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}