import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    let query: any = {};

    if (search) {
      // 1. Search string ko individual words mein todna (e.g., "Women Kurtis" -> ["Women", "Kurtis"])
      // filter(Boolean) se extra spaces hat jayenge
      const keywords = search.split(/\s+/).filter(Boolean);

      if (keywords.length > 0) {
        // 2. Har keyword ke liye ek regex array banana
        // Hum chahte hain ki agar product ke Name, Description, Category ya Color mein koi bhi keyword ho
        query.$or = keywords.flatMap((word) => [
          { name: { $regex: word, $options: "i" } },
          { description: { $regex: word, $options: "i" } },
          { category: { $regex: word, $options: "i" } },
          { color: { $regex: word, $options: "i" } }, // Color bhi check karega
        ]);
      }
    }

    if (category) {
      query.category = category;
    }

    // 3. Results fetch karna
    const products = await Product.find(query).sort({ createdAt: -1 });

    return NextResponse.json(products);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Error fetching products" },
      { status: 500 }
    );
  }
}