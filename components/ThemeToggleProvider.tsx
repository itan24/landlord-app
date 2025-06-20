"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";

/**
 * Theme context type definition
 */
interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

// Create theme context with undefined default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeToggleProvider Component
 * 
 * Provides theme management functionality throughout the application:
 * - Light/dark theme switching
 * - Local storage persistence
 * - System preference detection
 * - CSS class management for Tailwind dark mode
 * 
 * @param children - React components to be wrapped with theme context
 */
export function ThemeToggleProvider({ children }: { children: ReactNode }) {
  // State management
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // Initialize theme on component mount
  useEffect(() => {
    // Get saved theme from localStorage or use system preference
    const savedTheme = localStorage.getItem("landlord-app-theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    
    setTheme(initialTheme);
    setMounted(true);
  }, []);

  // Update theme in localStorage and apply CSS classes
  useEffect(() => {
    if (mounted) {
      // Save theme preference to localStorage
      localStorage.setItem("landlord-app-theme", theme);
      
      // Apply theme to document element for Tailwind CSS
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme, mounted]);

  /**
   * Toggles between light and dark themes
   */
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme Hook
 * 
 * Custom hook to access theme context within components.
 * Must be used within a ThemeToggleProvider.
 * 
 * @returns Theme context with current theme and toggle function
 * @throws Error if used outside of ThemeToggleProvider
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeToggleProvider");
  }
  return context;
}