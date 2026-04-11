import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    for (const item of items) {
      const idToSearch = item.id || item.productId;
      
      if (!idToSearch) {
        return NextResponse.json({ error: "Product ID missing for " + item.name }, { status: 400 });
      }

      const product = await Product.findById(idToSearch);

      if (!product) {
        return NextResponse.json(
          { error: `Item "${item.name}" not found in our collection.` },
          { status: 404 }
        );
      }

      if (product.quantity < item.quantity) {
        return NextResponse.json(
          { 
            error: `Only ${product.quantity} units of "${item.name}" available.` 
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ message: "Stock OK" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}