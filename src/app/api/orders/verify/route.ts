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
    
    const checkOrder = await Order.findById(orderId);
    if (!checkOrder) {
        return NextResponse.json({ error: "Order context reference not found" }, { status: 404 });
    }
    const customerEmail = checkOrder.userEmail || checkOrder.shippingAddress?.email;

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

    // 🔥 FIXED: Loop through items and decrement global AND specific size stock for online payments
    // 🔥 FIXED & SAFE: Loop through items and decrement global AND specific size stock for online payments
    const updatePromises = updatedOrder.items.map((item: any) => {
      const targetProductId = item.productId;
      const purchasedSize = item.size; // e.g., "S", "M", "L"
      const purchasedQty = Number(item.quantity);

      // Agar kisi wajah se array casting issue ho, toh string backup ensure karein
      if (!purchasedSize) {
        console.error(`❌ Size missing for item in order verification loop: ${item.name}`);
        return Promise.resolve(); // Safe skip to prevent crash
      }

      // 🔥 Path targeting the dynamic size inside Mongoose Map/Object structure strictly
      const sizeFieldPath = `sizeVariants.${purchasedSize}`;

      return Product.findByIdAndUpdate(
        targetProductId,
        { 
          $inc: { 
            quantity: -purchasedQty,         // Global total quantity me se total pieces minus honge
            [sizeFieldPath]: -purchasedQty   // Particular size database me decrement hoga (S: -2, L: -1)
          } 
        },
        { new: true }
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