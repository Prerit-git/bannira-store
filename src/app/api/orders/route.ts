import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { sendOrderEmail } from "@/lib/mail";
import { revalidatePath } from "next/cache";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { 
      userId, items, address, subtotal, shippingCharge, 
      tax, discount, total, paymentMethod, isOnlinePaymentInit 
    } = body;

    // --- 1. COMMON STOCK CHECK ---
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

    // --- CASE A: ONLINE PAYMENT INITIALIZATION (UPI) ---
    if (paymentMethod === "upi" && isOnlinePaymentInit) {
      // Razorpay Order options configure karein
      const razorpayOptions = {
        amount: Math.round(total * 100), // Razorpay amount Paise mein leta hai (₹1 = 100 Paise)
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
      };

      // Razorpay gateway se order create karein
      const razorpayOrder = await razorpay.orders.create(razorpayOptions);

      // MongoDB mein entry create karein par status "Pending" rakhein
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
        paymentStatus: "Pending",
        orderStatus: "Pending", 
        razorpayOrderId: razorpayOrder.id,
      });


      return NextResponse.json({ 
        success: true, 
        order: newOrder,
        razorpayOrder
      }, { status: 201 });
    }

    // --- CASE B: CASH ON DELIVERY (COD) ---
    if (paymentMethod === "cod") {
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
        paymentStatus: "Pending",
        orderStatus: "Processing",
      });

      // Update Product Inventory (Only for COD here)
      const updatePromises = items.map((item: any) => {
        return Product.findByIdAndUpdate(
          item.productId || item._id,
          { $inc: { quantity: -item.quantity } }
        );
      });
      await Promise.all(updatePromises);

      // Send Confirmation Email immediately for COD
      try {
        await sendOrderEmail(address.email, {
          orderId: newOrder._id,
          total: total,
          items: items,
          address: address
        });
        console.log("✅ COD Confirmation email sent to:", address.email);
      } catch (mailError) {
        console.error("❌ Email failed but order was placed:", mailError);
      }

      revalidatePath('/products');

      return NextResponse.json({ 
        success: true, 
        order: newOrder,
      }, { status: 201 });
    }

    return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });

  } catch (error: any) {
    console.error("Order Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}