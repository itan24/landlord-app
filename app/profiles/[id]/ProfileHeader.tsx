"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Pencil, CheckCircle, Clock } from "lucide-react";
import React from "react";

/**
 * Interface for profile data structure
 */
interface ProfileHeaderProps {
  profile: {
    tenantName: string;
    contactNumber: string;
    rent?: number;
    securityDeposit?: number;
    moveInDate?: string;
    description?: string;
    bills?: { status: string }[];
  };
  onEdit: () => void;
  isLoading?: boolean;
}

/**
 * ProfileHeader Component
 * 
 * Displays tenant profile information in a card format with edit functionality
 * and payment status indicators. Shows loading skeleton when data is being fetched.
 */
export function ProfileHeader({ profile, onEdit, isLoading }: ProfileHeaderProps) {
  // Loading skeleton component
  if (isLoading || !profile) {
    return (
      <Card className="mb-8 bg-white/70 dark:bg-[#232a3d]/70 backdrop-blur-md shadow-2xl border-0">
        <CardHeader className="flex flex-col items-center gap-2 relative min-h-[180px]">
          <div className="animate-pulse w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 mb-2" />
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
        </CardHeader>
      </Card>
    );
  }

  // Get the most recent bill status for payment indicator
  const recentBillStatus = profile.bills && profile.bills.length > 0 
    ? profile.bills[0].status 
    : null;

  return (
    <Card className="mb-8 bg-white/70 dark:bg-[#232a3d]/70 backdrop-blur-md shadow-2xl border-0">
      <CardHeader className="flex flex-col items-center gap-2 relative">
        {/* Profile Icon */}
        <User className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 dark:text-blue-300 mb-2 animate-bounce" />
        
        {/* Edit Button */}
        <button
          className="absolute top-2 right-2 p-2 rounded-full bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          onClick={onEdit}
          title="Edit Profile"
          type="button"
        >
          <Pencil className="w-5 h-5 text-blue-600 dark:text-blue-300" />
        </button>
        
        {/* Profile Title */}
        <CardTitle className="text-xl sm:text-2xl font-extrabold tracking-tight text-center">
          Tenant Profile
        </CardTitle>
        
        {/* Profile Information */}
        <div className="text-center mt-2">
          {/* Tenant Name */}
          <div className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {profile.tenantName}
          </div>
          
          {/* Payment Status Indicator */}
          {recentBillStatus && (
            <div className="flex items-center justify-center gap-2 mt-1">
              {recentBillStatus === "paid" ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-green-600 dark:text-green-400 font-semibold">
                    Paid
                  </span>
                </>
              ) : (
                <>
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
                    Pending
                  </span>
                </>
              )}
            </div>
          )}
          
          {/* Contact Information */}
          <div className="text-base text-gray-600 dark:text-gray-300">
            Contact: {profile.contactNumber}
          </div>
          
          {/* Financial Information */}
          <div className="text-base text-gray-600 dark:text-gray-300">
            Rent: {profile.rent ? `PKR ${profile.rent}` : "Not set"}
          </div>
          <div className="text-base text-gray-600 dark:text-gray-300">
            Security Deposit: {profile.securityDeposit ? `PKR ${profile.securityDeposit}` : "Not set"}
          </div>
          
          {/* Additional Details */}
          <div className="text-base text-gray-600 dark:text-gray-300">
            Move-in Date: {profile.moveInDate ? new Date(profile.moveInDate).toLocaleDateString() : "Not set"}
          </div>
          <div className="text-base text-gray-600 dark:text-gray-300">
            Description: {profile.description || "None"}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
} 