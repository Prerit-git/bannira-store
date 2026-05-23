import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { sendOrderEmail } from "@/lib/mail";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

    // 1. Signature Verification
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest("hex");
    
    if (expectedSign !== razorpay_signature) {
        return NextResponse.json({ error: "Payment verification failed. Genuine signature mismatch." }, { status: 400 });
    }
    
    // Pehle check kar lein ki order sach mein exist karta hai ya nahi data extraction ke liye
    const checkOrder = await Order.findById(orderId);
    if (!checkOrder) {
        return NextResponse.json({ error: "Order context reference not found" }, { status: 404 });
    }
    const customerEmail = checkOrder.userEmail || checkOrder.shippingAddress?.email;

    // 2. CRITICAL DUPLICATE FIX: .save() hatakar strict findByIdAndUpdate laga diya hai
    // Yeh guaranteed usi single document ko modify karega, naya kabhi nahi banayega
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          paymentStatus: "Paid",
          orderStatus: "Processing",
          razorpayPaymentId: razorpay_payment_id
        }
      },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "Failed to update the order state." }, { status: 500 });
    }

    const updatePromises = updatedOrder.items.map((item: any) => {
      return Product.findByIdAndUpdate(
        item.productId,
        { $inc: { quantity: -item.quantity } }
      );
    });
    await Promise.all(updatePromises);

    // 4. Safe Email Dispatch Flow
    if (!customerEmail) {
      console.error("❌ Cannot send email: Customer email is missing in order document.");
    } else {
      try {
        await sendOrderEmail(customerEmail, {
          orderId: updatedOrder._id,
          total: updatedOrder.totalAmount,
          items: updatedOrder.items,
          address: updatedOrder.shippingAddress
        });
        console.log(`✅ Online Paid Confirmation email sent to: ${customerEmail}`);
      } catch (mailError) {
        console.error("❌ Email failed but payment was completed:", mailError);
      }
    }

    revalidatePath('/products');

    // Return the safely updated order document reference
    return NextResponse.json({ 
      success: true, 
      order: updatedOrder 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Verification Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}