"use client";

import { useEffect, useState } from "react";

/**
 * AnimatedBackground Component
 * 
 * Provides dynamic animated background elements including:
 * - Floating particles with different animations
 * - Wave effects
 * - Pulse elements
 * - Responsive design for different screen sizes
 * 
 * @returns JSX element with animated background elements
 */
export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Floating Particles */}
      <div className="floating-particle w-4 h-4 top-1/4 left-1/4 opacity-70" />
      <div className="floating-particle w-6 h-6 top-1/3 right-1/4 opacity-60" />
      <div className="floating-particle w-3 h-3 top-2/3 left-1/3 opacity-80" />
      <div className="floating-particle w-5 h-5 bottom-1/4 right-1/3 opacity-70" />
      <div className="floating-particle w-4 h-4 top-1/2 left-1/6 opacity-60" />
      <div className="floating-particle w-7 h-7 bottom-1/3 left-1/4 opacity-50" />
      
      {/* Wave Elements */}
      <div className="wave-element w-32 h-32 top-1/4 left-0 opacity-30" />
      <div className="wave-element w-24 h-24 bottom-1/4 right-0 opacity-25" />
      <div className="wave-element w-40 h-40 top-1/2 left-1/2 opacity-20" />
      
      {/* Pulse Elements */}
      <div className="pulse-element w-20 h-20 top-1/6 right-1/6" />
      <div className="pulse-element w-16 h-16 bottom-1/6 left-1/6" />
      <div className="pulse-element w-12 h-12 top-3/4 right-1/3" />
      
      {/* Large Background Orbs */}
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-2000" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent animate-pulse delay-1000" />
      </div>
      
      {/* Floating Geometric Shapes */}
      <div className="absolute top-1/5 right-1/5 w-8 h-8 border-2 border-blue-400/30 rotate-45 animate-pulse delay-500" />
      <div className="absolute bottom-1/5 left-1/5 w-6 h-6 bg-purple-400/20 rounded-full animate-pulse delay-1500" />
      <div className="absolute top-3/4 right-1/4 w-10 h-10 border-2 border-cyan-400/30 rotate-12 animate-pulse delay-2000" />
      
      {/* Responsive Elements for Larger Screens */}
      <div className="hidden lg:block">
        <div className="floating-particle w-8 h-8 top-1/6 right-1/6 opacity-50" />
        <div className="floating-particle w-5 h-5 bottom-1/6 left-1/6 opacity-60" />
        <div className="wave-element w-48 h-48 top-1/3 right-0 opacity-15" />
        <div className="pulse-element w-24 h-24 top-1/4 left-0" />
      </div>
      
      {/* Mobile Optimized Elements */}
      <div className="lg:hidden">
        <div className="floating-particle w-3 h-3 top-1/5 right-1/5 opacity-70" />
        <div className="floating-particle w-4 h-4 bottom-1/5 left-1/5 opacity-60" />
        <div className="wave-element w-20 h-20 top-1/2 right-0 opacity-25" />
      </div>
    </div>
  );
} 