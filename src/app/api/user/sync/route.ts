import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Product"; 

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email })
      .populate({
        path: "wishlist",
        model: Product
      })
      .populate({
        path: "cart.productId",
        model: Product
      });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const formattedWishlist = (user.wishlist || []).map((item: any) => ({
      ...item._doc,
      id: item._id.toString(),
    }));

    const formattedCart = (user.cart || []).map((item: any) => {
      if (!item.productId) return null;
      return {
        id: item.productId._id.toString(),
        name: item.productId.name,
        price: item.productId.price,
        image: item.productId.image,
        size: item.size,
        quantity: item.quantity
      };
    }).filter(Boolean);

    return NextResponse.json({
      wishlist: formattedWishlist,
      cart: formattedCart
    }, { 
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0" 
      }
    });

  } catch (error: any) {
    console.error("SYNC_GET_ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}