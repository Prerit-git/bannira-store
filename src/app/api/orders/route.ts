import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { sendOrderEmail } from "@/lib/mail";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { userId, items, address, subtotal, shippingCharge, tax, discount, total, paymentMethod } = body;

    // Stock check
    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return NextResponse.json({ error: `Product ${item.name} not found` }, { status: 404 });
      }

      if (product.quantity < item.quantity) {
        return NextResponse.json({ 
          error: `Sorry, only ${product.quantity} units of ${item.name} are available.` 
        }, { status: 400 });
      }
    }

    // 1. Create the Order in MongoDB
    const newOrder = await Order.create({
      user: userId,
      userName: address.fullName,
      userEmail: address.email,
      items,
      shippingAddress: address,
      subtotal,
      shippingCharge,
      discount,
      tax,
      totalAmount: total,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "Pending" : "Paid",
      orderStatus: "Processing",
    });

    // 2. Update Product Inventory (Quantity decrement)
    const updatePromises = items.map((item: any) => {
      return Product.findByIdAndUpdate(
        item.productId || item._id,
        { $inc: { quantity: -item.quantity } }
      );
    });
    await Promise.all(updatePromises);

    // 3. Send Confirmation Email 
    try {
      await sendOrderEmail(address.email, {
        orderId: newOrder._id,
        total: total,
        items: items,
        address: address
      });
      console.log("✅ Confirmation email sent to:", address.email);
    } catch (mailError) {
      console.error("❌ Email failed but order was placed:", mailError);
    }

    revalidatePath('/products');

    // 4. Final Success Response
    return NextResponse.json({ 
      success: true, 
      order: newOrder,
    }, { status: 201 });

  } catch (error: any) {
    console.error("Order Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}