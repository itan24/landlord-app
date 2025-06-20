import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

/**
 * Parameters interface for profile ID route
 */
interface Params {
  id: string;
}

/**
 * GET /api/profiles/[id]
 * 
 * Retrieves a specific tenant profile by ID.
 * Requires authentication and ownership verification.
 * Includes the 5 most recent bills for the profile.
 * 
 * @param request - HTTP request object
 * @param params - Route parameters containing profile ID
 * @returns JSON response with profile data or error
 */
export async function GET(request: Request, { params }: { params: Promise<Params> }) {
  // Verify user authentication
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extract and parse profile ID from route parameters
  const { id } = await params;
  const profileId = parseInt(id);

  try {
    // Fetch profile with recent bills, ensuring user ownership
    const profile = await prisma.profile.findUnique({
      where: { id: profileId, userId: parseInt(session.user.id) },
      include: { bills: { orderBy: { date: "desc" }, take: 5 } },
    });
    
    // Check if profile exists
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PUT /api/profiles/[id]
 * 
 * Updates a specific tenant profile by ID.
 * Requires authentication and ownership verification.
 * 
 * @param request - HTTP request containing updated profile data
 * @param params - Route parameters containing profile ID
 * @returns JSON response with updated profile or error
 */
export async function PUT(request: Request, { params }: { params: Promise<Params> }) {
  // Verify user authentication
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extract profile ID and updated data
  const { id } = await params;
  const profileId = parseInt(id);
  const { tenantName, contactNumber, securityDeposit, moveInDate, description, rent } = await request.json();

  try {
    // Update profile in database, ensuring user ownership
    const profile = await prisma.profile.update({
      where: { id: profileId, userId: parseInt(session.user.id) },
      data: {
        tenantName,
        contactNumber,
        securityDeposit: securityDeposit ? parseInt(securityDeposit) : null,
        moveInDate: moveInDate ? new Date(moveInDate) : null,
        description: description || null,
        rent: rent ? parseInt(rent) : null,
      },
    });
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/profiles/[id]
 * 
 * Deletes a specific tenant profile by ID.
 * Requires authentication and ownership verification.
 * 
 * @param request - HTTP request object
 * @param params - Route parameters containing profile ID
 * @returns JSON response with success message or error
 */
export async function DELETE(request: Request, { params }: { params: Promise<Params> }) {
  // Verify user authentication
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extract and parse profile ID from route parameters
  const { id } = await params;
  const profileId = parseInt(id);

  try {
    // Delete profile from database, ensuring user ownership
    await prisma.profile.delete({
      where: { id: profileId, userId: parseInt(session.user.id) },
    });
    
    return NextResponse.json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}