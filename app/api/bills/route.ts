import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

/**
 * POST /api/bills
 * 
 * Creates a new bill for a tenant profile.
 * Requires authentication and valid profile ID, rent amount, and contact number.
 * 
 * @param request - HTTP request containing bill data
 * @returns JSON response with created bill or error message
 */
export async function POST(request: Request) {
  // Verify user authentication
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Extract bill data from request body
    const { profileId, rent, electric, gas, water, customFields, contactNumber, description } = await request.json();
    
    // Validate required fields
    if (!profileId || !rent || !contactNumber) {
      return NextResponse.json({ 
        error: "Profile ID, Rent, and Contact Number are required" 
      }, { status: 400 });
    }

    // Calculate total bill amount including all components
    const total =
      parseInt(rent) +
      (electric ? parseInt(electric) : 0) +
      (gas ? parseInt(gas) : 0) +
      (water ? parseInt(water) : 0) +
      (customFields ? customFields.reduce((sum: number, field: { amount: number }) => sum + field.amount, 0) : 0);

    // Create bill record in database
    const bill = await prisma.bill.create({
      data: {
        profileId: parseInt(profileId),
        date: new Date(),
        rent: parseInt(rent),
        electric: electric ? parseInt(electric) : null,
        gas: gas ? parseInt(gas) : null,
        water: water ? parseInt(water) : null,
        customFields: customFields || null,
        total,
        contactNumber,
        description: description || null,
        status: "pending",
      },
    });

    return NextResponse.json(bill, { status: 201 });
  } catch (error) {
    console.error("Error creating bill:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * GET /api/bills
 * 
 * Retrieves recent bills for a specific tenant profile.
 * Requires authentication and profile ID query parameter.
 * Returns the 5 most recent bills for the profile.
 * 
 * @param request - HTTP request with profileId query parameter
 * @returns JSON response with bills array or error message
 */
export async function GET(request: Request) {
  // Verify user authentication
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extract profile ID from query parameters
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get("profileId");

  // Validate profile ID parameter
  if (!profileId) {
    return NextResponse.json({ error: "Profile ID is required" }, { status: 400 });
  }

  try {
    // Fetch recent bills for the specified profile
    const bills = await prisma.bill.findMany({
      where: {
        profileId: parseInt(profileId),
        profile: { userId: parseInt(session.user.id) },
      },
      orderBy: { date: "desc" },
      take: 5,
    });
    
    return NextResponse.json(bills);
  } catch (error) {
    console.error("Error fetching bills:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}