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
      const selectedSize = item.size;
      
      if (!idToSearch) {
        return NextResponse.json({ error: "Product ID missing for " + item.name }, { status: 400 });
      }

      if (!selectedSize) {
        return NextResponse.json({ error: `Size parameter missing for product "${item.name}".` }, { status: 400 });
      }

      const product = await Product.findById(idToSearch);

      if (!product) {
        return NextResponse.json(
          { error: `Item "${item.name}" not found in our collection.` },
          { status: 404 }
        );
      }

      const sizeStockAvailable = product.sizeVariants 
        ? (product.sizeVariants instanceof Map ? product.sizeVariants.get(selectedSize) : product.sizeVariants[selectedSize]) || 0
        : 0;

      // 🔥 FIXED: Check against specific variant stock instead of global root quantity
      if (sizeStockAvailable < item.quantity) {
        if (sizeStockAvailable === 0) {
          return NextResponse.json(
            { 
              error: `Sorry, Size ${selectedSize} for "${item.name}" is completely Sold Out.` 
            },
            { status: 400 }
          );
        }
        
        return NextResponse.json(
          { 
            error: `Only ${sizeStockAvailable} units of "${item.name}" (Size ${selectedSize}) are available in stock.` 
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