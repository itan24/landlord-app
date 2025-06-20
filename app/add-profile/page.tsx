"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UserPlus } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";

// Form validation schema for tenant profile creation
const profileSchema = z.object({
  tenantName: z.string().min(2, "Name must be at least 2 characters"),
  contactNumber: z.string().min(10, "Contact must be at least 10 characters"),
  roomNumber: z.string().min(1, "Room number is required"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

/**
 * AddProfile Component
 * 
 * Handles the creation of new tenant profiles with form validation
 * and API integration for data persistence.
 */
export default function AddProfile() {
  // Initialize form with validation and default values
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      tenantName: "",
      contactNumber: "",
      roomNumber: "",
    },
  });

  /**
   * Handles form submission to create a new tenant profile
   * @param data - Validated form data containing tenant information
   */
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // TODO: Add success notification and navigation
        console.log("Profile created successfully:", result);
      } else {
        // TODO: Add error notification
        console.error("Failed to create profile:", result.error || "Unknown error");
      }
    } catch (error) {
      // TODO: Add network error notification
      console.error("Network error during profile creation:", error);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 dark:from-[#181c2b] dark:via-[#232a3d] dark:to-[#1a1f2e] animate-gradient-move px-2 sm:px-4 py-8">
      {/* Enhanced Animated Background */}
      <AnimatedBackground />
      
      {/* Main form card with glassmorphism effect */}
      <Card className="relative z-10 w-full max-w-sm sm:max-w-md mx-auto bg-white/70 dark:bg-[#232a3d]/70 backdrop-blur-md shadow-2xl border-0 animate-fade-in glass-effect">
        <CardHeader className="flex flex-col items-center gap-2">
          <UserPlus className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 dark:text-blue-300 mb-2 animate-bounce" />
          <CardTitle className="text-xl sm:text-2xl font-extrabold tracking-tight text-center">
            Add Profile
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Tenant Name Field */}
              <FormField
                control={form.control}
                name="tenantName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tenant name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Contact Number Field */}
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Room Number Field */}
              <FormField
                control={form.control}
                name="roomNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter room number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-full shadow-lg px-6 py-2 transition-all duration-200"
              >
                <UserPlus className="w-5 h-5 mr-2" /> 
                Add Profile
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Custom CSS animations */}
      <style jsx global>{`
        @keyframes gradient-move {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradient-move 8s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fadeIn 1.2s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </main>
  );
}