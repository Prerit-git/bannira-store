import { NextResponse } from "next/server";
import UserAddress from "@/models/UserAddress";
import { getServerSession } from "next-auth/next";
import { connectDB } from "@/lib/mongodb";

// 1. GET: Fetch all saved addresses for the logged-in user
export async function GET(req: Request) {
  try {
    await connectDB();
    
    // Yahan auth context se user nikalna hai (Aap custom header ya session use kar sakte ho)
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const addresses = await UserAddress.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, addresses });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. POST: Save New Address or Update existing one
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { userId, addressId, ...addressData } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 });
    }

    if (addressId) {
      // Edit / Update existing address workflow
      const updatedAddress = await UserAddress.findByIdAndUpdate(
        addressId,
        { ...addressData },
        { new: true }
      );
      return NextResponse.json({ success: true, address: updatedAddress, message: "Address updated successfully" });
    } else {
      // Create new address item matrix
      const newAddress = await UserAddress.create({
        userId,
        ...addressData,
      });
      return NextResponse.json({ success: true, address: newAddress, message: "Address saved successfully" });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 3. DELETE: Remove address entry mapping
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const addressId = searchParams.get("addressId");

    if (!addressId) {
      return NextResponse.json({ success: false, error: "Address ID required" }, { status: 400 });
    }

    await UserAddress.findByIdAndDelete(addressId);
    return NextResponse.json({ success: true, message: "Address deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}