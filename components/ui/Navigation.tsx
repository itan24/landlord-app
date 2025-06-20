"use client";

import Link from "next/link";
import { Home, UserPlus, LayoutDashboard, LogOut, LogIn, Moon, Sun, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeToggleProvider";

/**
 * Navigation Component
 * 
 * Responsive navigation bar with the following features:
 * - Desktop and mobile navigation
 * - Authentication status management
 * - Theme toggle functionality
 * - Smooth animations and transitions
 * - Accessible navigation elements
 */
export function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const { status } = useSession();
  
  // State management
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Ensure component is mounted for theme hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Handles user sign out with redirect to home page
   */
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // Navigation links configuration
  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/add-profile", label: "Add Profile", icon: UserPlus },
  ];

  return (
    <nav className="bg-gray-800 dark:bg-gray-950 py-4 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <motion.li
                key={link.href}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="list-none"
              >
                <Button
                  variant="ghost"
                  className="text-gray-100 dark:text-gray-200 flex items-center gap-2 text-base"
                  asChild
                >
                  <Link href={link.href} onClick={() => setMobileOpen(false)}>
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                </Button>
              </motion.li>
            ))}
          </ul>
          
          {/* Mobile Hamburger Menu Button */}
          <button
            className="md:hidden flex items-center text-gray-100 dark:text-gray-200 focus:outline-none"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Open navigation menu"
            type="button"
          >
            {mobileOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
          
          {/* Desktop Authentication and Theme Controls */}
          <div className="hidden md:flex items-center gap-4">
            {status === "authenticated" ? (
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="text-gray-100 dark:text-gray-200 flex items-center gap-2 text-base"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="text-gray-100 dark:text-gray-200 flex items-center gap-2 text-base"
              >
                <LogIn className="h-5 w-5" />
                Sign In
              </Button>
            )}
            
            {/* Theme Toggle Button */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-gray-100 dark:text-gray-200"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {mobileOpen && (
          <div className="md:hidden mt-4 bg-gray-800 dark:bg-gray-950 rounded-lg shadow-lg p-4 flex flex-col gap-4 animate-fade-in">
            {/* Mobile Navigation Links */}
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-100 dark:text-gray-200 flex items-center gap-2 text-base"
                    asChild
                  >
                    <Link href={link.href} onClick={() => setMobileOpen(false)}>
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
            
            {/* Mobile Authentication and Theme Controls */}
            <div className="flex flex-col gap-2 border-t border-gray-700 pt-4">
              {status === "authenticated" ? (
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="w-full justify-start text-gray-100 dark:text-gray-200 flex items-center gap-2 text-base"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                  className="w-full justify-start text-gray-100 dark:text-gray-200 flex items-center gap-2 text-base"
                >
                  <LogIn className="h-5 w-5" />
                  Sign In
                </Button>
              )}
              
              {/* Mobile Theme Toggle Button */}
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="text-gray-100 dark:text-gray-200 self-start"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}