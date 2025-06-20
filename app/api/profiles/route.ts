import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

/**
 * POST /api/profiles
 * 
 * Creates a new tenant profile for the authenticated user.
 * Requires authentication and valid tenant name and contact number.
 * 
 * @param req - HTTP request containing profile data
 * @returns JSON response with created profile or error message
 */
export async function POST(req: Request) {
  // Verify user authentication
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Extract profile data from request body
    const { tenantName, contactNumber, roomNumber, securityDeposit, moveInDate, description, rent } = await req.json();
    
    // Validate required fields
    if (!tenantName || !contactNumber) {
      return NextResponse.json({ 
        error: "Name & Contact Number required" 
      }, { status: 400 });
    }

    // Create profile record in database
    const profile = await prisma.profile.create({
      data: {
        userId: parseInt(session.user.id),
        tenantName,
        contactNumber,
        roomNumber: roomNumber || "Unknown",
        securityDeposit: securityDeposit ? parseInt(securityDeposit) : null,
        moveInDate: moveInDate ? new Date(moveInDate) : null,
        description: description || null,
        rent: rent ? parseInt(rent) : null,
      },
    });
    
    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * GET /api/profiles
 * 
 * Retrieves all tenant profiles for the authenticated user.
 * Includes the most recent bill for each profile.
 * 
 * @returns JSON response with profiles array or error message
 */
export async function GET() {
  // Verify user authentication
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all profiles for the authenticated user with recent bills
    const profiles = await prisma.profile.findMany({
      where: { userId: parseInt(session.user.id) },
      include: { bills: { orderBy: { date: "desc" }, take: 1 } },
    });
    
    return NextResponse.json(profiles);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}