import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

/**
 * Parameters interface for bill ID route
 */
interface Params {
  id: string;
}

/**
 * DELETE /api/bills/[id]
 * 
 * Deletes a specific bill by ID.
 * Requires authentication and ownership verification.
 * 
 * @param request - HTTP request object
 * @param params - Route parameters containing bill ID
 * @returns JSON response with success message or error
 */
export async function DELETE(request: Request, { params }: { params: Promise<Params> }) {
  // Verify user authentication
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extract and parse bill ID from route parameters
  const { id } = await params;
  const billId = parseInt(id);

  try {
    // Find bill and verify ownership
    const bill = await prisma.bill.findUnique({
      where: { id: billId },
      include: { profile: { select: { userId: true } } },
    });

    // Check if bill exists and belongs to the authenticated user
    if (!bill || bill.profile.userId !== parseInt(session.user.id)) {
      return NextResponse.json({ 
        error: "Bill not found or you don't have permission to access it" 
      }, { status: 404 });
    }

    // Delete the bill from database
    await prisma.bill.delete({
      where: { id: billId },
    });

    return NextResponse.json({ message: "Bill deleted successfully" });
  } catch (error) {
    console.error("Error deleting bill:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH /api/bills/[id]
 * 
 * Toggles the payment status of a bill between 'pending' and 'paid'.
 * Requires authentication and ownership verification.
 * 
 * @param request - HTTP request object
 * @param params - Route parameters containing bill ID
 * @returns JSON response with updated bill or error
 */
export async function PATCH(request: Request, { params }: { params: Promise<Params> }) {
  // Verify user authentication
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extract and parse bill ID from route parameters
  const { id } = await params;
  const billId = parseInt(id);

  try {
    // Find bill and verify ownership
    const bill = await prisma.bill.findUnique({
      where: { id: billId },
      include: { profile: { select: { userId: true } } },
    });

    // Check if bill exists and belongs to the authenticated user
    if (!bill || bill.profile.userId !== parseInt(session.user.id)) {
      return NextResponse.json({ 
        error: "Bill not found or you don't have permission to access it" 
      }, { status: 404 });
    }

    // Toggle bill status between pending and paid
    const newStatus = bill.status === "pending" ? "paid" : "pending";

    // Update bill status in database
    const updatedBill = await prisma.bill.update({
      where: { id: billId },
      data: { status: newStatus },
    });

    return NextResponse.json(updatedBill);
  } catch (error) {
    console.error("Error updating bill status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}