import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { wishlist, cart } = body;

    await connectDB();

    const updateData: any = {};

    if (wishlist !== undefined) updateData.wishlist = wishlist;
    if (cart !== undefined) updateData.cart = cart;

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: updateData },
      { returnDocument: 'after', upsert: true }
    );

    console.log("ATLAS UPDATED SUCCESSFULLY:", updateData);

    return NextResponse.json({ 
      message: "Sync Successful", 
      wishlist: updatedUser.wishlist, 
      cart: updatedUser.cart 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}