"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Send, Trash2, CheckCircle, Clock } from "lucide-react";
import { ProfileHeader } from "./ProfileHeader";
import AnimatedBackground from "@/components/AnimatedBackground";

// Form validation schemas
const billSchema = z.object({
  rent: z.string().min(1, "Rent is required"),
  electric: z.string().optional(),
  gas: z.string().optional(),
  water: z.string().optional(),
  contactNumber: z.string().regex(/^[0-9]{10}$/, "Please enter a 10-digit number (e.g., 3442691628)"),
  description: z.string().optional(),
});

const profileSchema = z.object({
  tenantName: z.string().min(2, "Name be 2 charachters"),
  contactNumber: z.string().regex(/^[0-9]{10}$/, "10 digits numbers (e.g., 3442691628)"),
  securityDeposit: z.string().regex(/^$|^[0-9]+$/, 'Must be a number or empty').optional(),
  moveInDate: z.string().optional(),
  description: z.string().optional(),
  rent: z.string().regex(/^$|^[0-9]+$/, 'Must be a number or empty').optional(),
});

// Type definitions
type BillFormValues = z.infer<typeof billSchema>;
type ProfileFormValues = z.infer<typeof profileSchema>;

/**
 * Custom field interface for additional bill items
 */
interface CustomFieldType {
  name: string;
  amount: number;
}

/**
 * Bill data structure
 */
interface BillType {
  id: number;
  date: string;
  rent: number;
  electric?: number;
  gas?: number;
  water?: number;
  customFields?: CustomFieldType[];
  total: number;
  contactNumber: string;
  status: string;
  description?: string;
}

/**
 * Profile data structure
 */
interface ProfileType {
  id: number;
  tenantName: string;
  contactNumber: string;
  securityDeposit?: number;
  moveInDate?: string;
  description?: string;
  rent?: number;
  bills?: BillType[];
}

/**
 * ProfileDetail Component
 * 
 * Main component for managing tenant profiles, including:
 * - Profile information display and editing
 * - Bill creation and management
 * - WhatsApp integration for bill sharing
 * - Payment status tracking
 */
export default function ProfileDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  // State management
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [customFields, setCustomFields] = useState<CustomFieldType[]>([]);
  const [editOpen, setEditOpen] = useState(false);

  // Form initialization
  const billForm = useForm<BillFormValues>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      rent: '',
      electric: '',
      gas: '',
      water: '',
      contactNumber: '',
      description: '',
    },
  });

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      tenantName: '',
      contactNumber: '',
      securityDeposit: '',
      moveInDate: '',
      description: '',
      rent: '',
    },
  });

  /**
   * Fetches profile data from API and populates forms
   */
  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`/api/profiles/${id}`);
      if (res.ok) {
        const data: ProfileType = await res.json();
        setProfile(data);
        
        // Populate bill form with profile data
        billForm.setValue("rent", data.rent !== undefined ? String(data.rent) : '');
        billForm.setValue("contactNumber", data.contactNumber.replace("+92", ""));
        
        // Populate profile form with current data
        profileForm.setValue("tenantName", data.tenantName);
        profileForm.setValue("contactNumber", data.contactNumber.replace("+92", ""));
        profileForm.setValue("securityDeposit", data.securityDeposit !== undefined ? String(data.securityDeposit) : '');
        profileForm.setValue("moveInDate", data.moveInDate ? new Date(data.moveInDate).toISOString().split("T")[0] : "");
        profileForm.setValue("description", data.description || "");
        profileForm.setValue("rent", data.rent !== undefined ? String(data.rent) : '');
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  }, [id, billForm, profileForm]);

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  /**
   * Handles bill form submission
   * @param data - Validated bill form data
   */
  const onBillSubmit = async (data: BillFormValues) => {
    try {
      // Calculate total including custom fields
      const total = Number(data.rent) +
        Number(data.electric || 0) +
        Number(data.gas || 0) +
        Number(data.water || 0) +
        customFields.reduce((sum, f) => sum + Number(f.amount || 0), 0);
      
      const formattedNumber = `+92${data.contactNumber}`;
      
      const res = await fetch("/api/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...data, 
          profileId: id, 
          total, 
          customFields, 
          contactNumber: formattedNumber 
        }),
      });
      
      if (res.ok) {
        fetchProfile();
        // Reset form with profile rent value
        billForm.reset({ 
          rent: profile!.rent !== undefined ? String(profile!.rent) : '', 
          contactNumber: "", 
          description: "" 
        });
        setCustomFields([]);
      }
    } catch (error) {
      console.error("Failed to create bill:", error);
    }
  };

  /**
   * Handles profile form submission for editing
   * @param data - Validated profile form data
   */
  const onProfileSubmit = async (data: ProfileFormValues) => {
    try {
      const formattedNumber = `+92${data.contactNumber}`;
      const res = await fetch(`/api/profiles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, contactNumber: formattedNumber }),
      });
      
      if (res.ok) {
        setEditOpen(false);
        fetchProfile();
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  /**
   * Deletes a bill by ID
   * @param billId - ID of the bill to delete
   */
  const deleteBill = async (billId: number) => {
    try {
      const res = await fetch(`/api/bills/${billId}`, { method: "DELETE" });
      if (res.ok) {
        fetchProfile();
      } else {
        console.error("Bill delete failed:", await res.json());
      }
    } catch (error) {
      console.error("Failed to delete bill:", error);
    }
  };

  /**
   * Toggles bill payment status between paid and pending
   * @param billId - ID of the bill to toggle
   */
  const toggleBillStatus = async (billId: number) => {
    try {
      const res = await fetch(`/api/bills/${billId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      
      if (res.ok) {
        fetchProfile();
      } else {
        console.error("Bill status update failed:", await res.json());
      }
    } catch (error) {
      console.error("Failed to toggle bill status:", error);
    }
  };

  /**
   * Adds a new custom field to the bill form
   */
  const addCustomField = () => {
    setCustomFields([...customFields, { name: "", amount: 0 }]);
  };

  /**
   * Removes a custom field from the bill form
   * @param index - Index of the field to remove
   */
  const deleteCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  /**
   * Updates a custom field value
   * @param index - Index of the field to update
   * @param key - Field property to update (name or amount)
   * @param value - New value for the field
   */
  const updateCustomField = (index: number, key: "name" | "amount", value: string) => {
    const newFields = [...customFields];
    if (key === "amount") {
      newFields[index][key] = value ? parseInt(value) : 0;
    } else {
      newFields[index][key] = value;
    }
    setCustomFields(newFields);
  };

  /**
   * Sends bill details to WhatsApp
   * @param data - Bill form data to send
   */
  const sendToWhatsApp = (data: BillFormValues) => {
    const total = Number(data.rent) +
      Number(data.electric || 0) +
      Number(data.gas || 0) +
      Number(data.water || 0) +
      customFields.reduce((sum, f) => sum + Number(f.amount || 0), 0);
    
    const formattedNumber = `+92${data.contactNumber}`;
    const message = `Bill Details for ${profile ? profile.tenantName : "Tenant"}:\nRent: PKR ${data.rent}\nElectric: PKR ${data.electric || 0}\nGas: PKR ${data.gas || 0}\nWater: PKR ${data.water || 0}\n${customFields.map(f => `${f.name}: PKR ${f.amount}`).join("\n")}\nTotal: PKR ${total}\nStatus: Pending${data.description ? `\nDescription: ${data.description}` : ""}`;
    
    window.open(`https://api.whatsapp.com/send?phone=${formattedNumber}&text=${encodeURIComponent(message)}`, "_blank");
  };

  /**
   * Sends existing bill details to WhatsApp
   * @param bill - Bill data to send
   */
  const sendExistingBillToWhatsApp = (bill: BillType) => {
    const formattedNumber = bill.contactNumber.startsWith("+92") ? bill.contactNumber : `+92${bill.contactNumber}`;
    const message = `Bill Details for ${profile ? profile.tenantName : "Tenant"}:\nRent: PKR ${bill.rent}\nElectric: PKR ${bill.electric || 0}\nGas: PKR ${bill.gas || 0}\nWater: PKR ${bill.water || 0}\n${bill.customFields ? bill.customFields.map((f: CustomFieldType) => `${f.name}: PKR ${f.amount}`).join("\n") : ""}\nTotal: PKR ${bill.total}\nStatus: ${bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}${bill.description ? `\nDescription: ${bill.description}` : ""}`;
    
    window.open(`https://api.whatsapp.com/send?phone=${formattedNumber}&text=${encodeURIComponent(message)}`, "_blank");
  };

  // Loading state
  if (!profile) return <div>Loading...</div>;

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 dark:from-[#181c2b] dark:via-[#232a3d] dark:to-[#1a1f2e] animate-gradient-move px-2 sm:px-4 py-8">
      {/* Enhanced Animated Background */}
      <AnimatedBackground />
      
      <div className="relative z-10 w-full max-w-lg sm:max-w-2xl md:max-w-3xl animate-fade-in">
        {/* Profile Header Component */}
        <ProfileHeader profile={profile} onEdit={() => setEditOpen(true)} isLoading={!profile} />
        
        {/* Bill Creation Form */}
        <Card className="glass-effect hover-lift mb-6">
          <CardHeader>
            <CardTitle>Add Bill</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...billForm}>
              <form onSubmit={billForm.handleSubmit(onBillSubmit)} className="space-y-4">
                {/* Rent Field */}
                <FormField
                  control={billForm.control}
                  name="rent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rent</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="" 
                          {...field} 
                          value={field.value ?? ''} 
                          onChange={e => field.onChange(e.target.value)} 
                          className="bg-light-blue" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Electric Bill Field */}
                <FormField
                  control={billForm.control}
                  name="electric"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Electric Bill</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="" 
                          {...field} 
                          value={field.value ?? ''} 
                          onChange={e => field.onChange(e.target.value)} 
                          className="bg-light-blue" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Gas Bill Field */}
                <FormField
                  control={billForm.control}
                  name="gas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gas Bill</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="" 
                          {...field} 
                          value={field.value ?? ''} 
                          onChange={e => field.onChange(e.target.value)} 
                          className="bg-light-blue" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Water Bill Field */}
                <FormField
                  control={billForm.control}
                  name="water"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Water Bill</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="" 
                          {...field} 
                          value={field.value ?? ''} 
                          onChange={e => field.onChange(e.target.value)} 
                          className="bg-light-blue" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Contact Number Field */}
                <FormField
                  control={billForm.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-3 h-10 bg-gray-100 border border-r-0 rounded-l-md text-gray-600">+92</span>
                          <Input
                            placeholder="3442691628"
                            {...field}
                            className="rounded-l-none"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Description Field */}
                <FormField
                  control={billForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter any additional message or note" 
                          {...field} 
                          className="bg-light-blue" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Custom Fields */}
                {customFields.map((field, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder="Field Name"
                      value={field.name || ''}
                      onChange={(e) => updateCustomField(index, "name", e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder=""
                      value={field.amount ?? ''}
                      onChange={e => updateCustomField(index, "amount", e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteCustomField(index)}
                      className="text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
                
                {/* Action Buttons */}
                <Button 
                  type="button" 
                  onClick={addCustomField} 
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-full shadow-lg px-6 py-2 transition-all duration-200"
                >
                  <Plus className="h-5 w-5" />
                  Add Custom Field
                </Button>
                
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-full shadow-lg px-6 py-2 transition-all duration-200"
                >
                  Calculate & Save
                </Button>
                
                <Button 
                  type="button" 
                  onClick={() => billForm.handleSubmit(sendToWhatsApp)()} 
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-full shadow-lg px-6 py-2 transition-all duration-200"
                >
                  <Send className="h-5 w-5" />
                  Send to WhatsApp
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Recent Bills Section */}
        <Card className="glass-effect hover-lift">
          <CardHeader>
            <CardTitle>Recent Bills</CardTitle>
          </CardHeader>
          <CardContent>
            {profile && profile.bills?.map((bill: BillType) => (
              <Card key={bill.id} className="mb-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">
                    Date: {new Date(bill.date).toLocaleDateString()}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => sendExistingBillToWhatsApp(bill)}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteBill(bill.id)}
                      className="text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>Rent: PKR {bill.rent}</p>
                  <p>Electric: {bill.electric ? `PKR ${bill.electric}` : "N/A"}</p>
                  <p>Gas: {bill.gas ? `PKR ${bill.gas}` : "N/A"}</p>
                  <p>Water: {bill.water ? `PKR ${bill.water}` : "N/A"}</p>
                  <p>Custom Fields: {bill.customFields ? bill.customFields.map((f: CustomFieldType) => `${f.name}: PKR ${f.amount}`).join(", ") : "None"}</p>
                  <p>Total: PKR {bill.total}</p>
                  <p>Contact: {bill.contactNumber}</p>
                  <p className="flex items-center gap-2">
                    Status: {bill.status === "paid" ? "Paid" : "Pending"}
                    {bill.status === "paid" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                  </p>
                  {bill.description && <p>Description: {bill.description}</p>}
                  <Button
                    variant="outline"
                    onClick={() => toggleBillStatus(bill.id)}
                    className="mt-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                  >
                    {bill.status === "pending" ? "Mark as Paid" : "Mark as Pending"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Edit Profile Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="glass-effect">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                {/* Tenant Name Field */}
                <FormField
                  control={profileForm.control}
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
                  control={profileForm.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-3 h-10 bg-gray-100 border border-r-0 rounded-l-md text-gray-600">+92</span>
                          <Input
                            placeholder="3442691628"
                            {...field}
                            className="rounded-l-none"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Security Deposit Field */}
                <FormField
                  control={profileForm.control}
                  name="securityDeposit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Security Deposit</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder=""
                          {...field}
                          value={field.value ?? ''}
                          onChange={e => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Move-in Date Field */}
                <FormField
                  control={profileForm.control}
                  name="moveInDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Move-in Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Description Field */}
                <FormField
                  control={profileForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter description" 
                          {...field} 
                          className="bg-light-blue" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Rent Field */}
                <FormField
                  control={profileForm.control}
                  name="rent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rent</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder=""
                          {...field}
                          value={field.value ?? ''}
                          onChange={e => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}