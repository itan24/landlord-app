"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Trash2, Users, CheckCircle, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import AnimatedBackground from "@/components/AnimatedBackground";

// Form validation schema for tenant profile creation
const profileSchema = z.object({
  tenantName: z.string().min(2, "Name must be at least 2 characters"),
  contactNumber: z.string().min(10, "Contact number must be at least 10 digits"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

/**
 * Profile interface for tenant data structure
 */
interface Profile {
  id: number;
  tenantName: string;
  contactNumber: string;
  updatedAt: string;
  rent?: number;
  bills?: { total?: number; status?: string }[];
}

/**
 * Dashboard Component
 * 
 * Main dashboard for property management with tenant profile management.
 * Features include:
 * - Authentication protection
 * - Tenant profile creation and deletion
 * - Payment status tracking
 * - Responsive grid layout for tenant cards
 */
export default function Dashboard() {
  const { status } = useSession();
  
  // State management
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [open, setOpen] = useState(false);

  // Form initialization with validation
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { tenantName: "", contactNumber: "" },
  });

  // Handle authentication and data fetching
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/api/auth/signin?callbackUrl=/dashboard");
    }
    if (status === "authenticated") {
      fetchProfiles();
    }
  }, [status]);

  /**
   * Fetches all tenant profiles from the API
   */
  const fetchProfiles = async () => {
    try {
      const res = await fetch("/api/profiles");
      if (res.ok) {
        const data = await res.json();
        setProfiles(data);
      } else {
        console.error("Failed to fetch profiles:", await res.json());
      }
    } catch (error) {
      console.error("Network error while fetching profiles:", error);
    }
  };

  /**
   * Handles form submission for creating new tenant profiles
   * @param data - Validated form data containing tenant information
   */
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (res.ok) {
        setOpen(false);
        fetchProfiles();
        form.reset();
      } else {
        console.error("Failed to create profile:", await res.json());
      }
    } catch (error) {
      console.error("Network error while creating profile:", error);
    }
  };

  /**
   * Deletes a tenant profile by ID
   * @param id - ID of the profile to delete
   */
  const deleteProfile = async (id: number) => {
    try {
      const res = await fetch(`/api/profiles/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProfiles();
      } else {
        console.error("Delete failed:", await res.json());
      }
    } catch (error) {
      console.error("Network error while deleting profile:", error);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 dark:from-[#181c2b] dark:via-[#232a3d] dark:to-[#1a1f2e] animate-gradient-move px-2 sm:px-4 py-8">
      {/* Enhanced Animated Background */}
      <AnimatedBackground />
      
      <div className="relative z-10 w-full max-w-6xl animate-fade-in">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <Users className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 dark:text-blue-300 animate-bounce" />
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-center">
            Property Management App
          </h1>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-200 text-center max-w-xl">
            All your tenants and bills in one beautiful dashboard.
          </p>
        </div>
        
        {/* Add Profile Button */}
        <Button
          className="flex items-center gap-2 mx-auto mb-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-bold rounded-full shadow-lg transition-all duration-200"
          onClick={() => setOpen(true)}
        >
          <UserPlus className="h-5 w-5 sm:h-6 sm:w-6" />
          Add Profile
        </Button>
        
        {/* Tenant Profiles Grid */}
        <div className="grid gap-4 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile: Profile) => (
            <Link href={`/profiles/${profile.id}`} key={profile.id} className="group">
              <Card className="relative bg-white/70 dark:bg-[#232a3d]/70 backdrop-blur-md shadow-2xl border-0 transition-transform duration-200 group-hover:scale-105 group-hover:shadow-3xl glass-effect hover-lift">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-bold">
                    {profile.tenantName}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteProfile(profile.id);
                    }}
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </Button>
                </CardHeader>
                
                <CardContent>
                  {/* Payment Status Indicator */}
                  {profile.bills && profile.bills.length > 0 && profile.bills[0].status && (
                    <div className="flex items-center gap-2 mb-2">
                      {profile.bills[0].status === "paid" ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                            Paid
                          </span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 text-yellow-500" />
                          <span className="text-yellow-600 dark:text-yellow-400 font-semibold text-sm">
                            Pending
                          </span>
                        </>
                      )}
                    </div>
                  )}
                  
                  {/* Profile Information */}
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Number: {profile.contactNumber}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Last Updated: {new Date(profile.updatedAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Rent: {profile.rent ? `PKR ${profile.rent}` : "Not set"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Last Payment: {profile.bills?.[0]?.total ? `PKR ${profile.bills[0].total}` : "None"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Create Profile Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white/80 dark:bg-[#232a3d]/80 backdrop-blur-md border-0 shadow-2xl animate-fade-in glass-effect">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Create Tenant Profile
            </DialogTitle>
          </DialogHeader>
          
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
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-full shadow-lg px-6 py-2"
                >
                  Create Profile
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
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