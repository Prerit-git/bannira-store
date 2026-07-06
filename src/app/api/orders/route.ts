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

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return NextResponse.json({ error: `Product ${item.name} not found` }, { status: 404 });
      }

      const selectedSize = item.size;
      
      let sizeVariantsObj: Record<string, number> = {};
      
      if (product.sizeVariants) {
        if (typeof product.sizeVariants.toJSON === 'function') {
          sizeVariantsObj = product.sizeVariants.toJSON();
        } else {
          sizeVariantsObj = product.sizeVariants;
        }
      }

      const sizeStockAvailable = sizeVariantsObj[selectedSize] !== undefined 
        ? Number(sizeVariantsObj[selectedSize]) 
        : 0;

      if (sizeStockAvailable < item.quantity) {
        if (sizeStockAvailable === 0) {
          return NextResponse.json({ 
            error: `Sorry, Size ${selectedSize} for "${item.name}" is completely Sold Out.` 
          }, { status: 400 });
        }
        return NextResponse.json({ 
          error: `Sorry, only ${sizeStockAvailable} units of ${item.name} (Size ${selectedSize}) are available.` 
        }, { status: 400 });
      }
    }

    if (paymentMethod === "upi" && isOnlinePaymentInit) {
      const razorpayOptions = {
        amount: Math.round(total * 100),
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
      };

      const razorpayOrder = await razorpay.orders.create(razorpayOptions);

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

      const updatePromises = items.map((item: any) => {
        const targetProductId = item.productId || item._id;
        const purchasedSize = item.size;
        const purchasedQty = Number(item.quantity);

        const sizeFieldPath = `sizeVariants.${purchasedSize}`;

        return Product.findByIdAndUpdate(
          targetProductId,
          { 
            $inc: { 
              quantity: -purchasedQty,     
              [sizeFieldPath]: -purchasedQty
            } 
          }
        );
      });
      await Promise.all(updatePromises);

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

export async function GET(req: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const userOrders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    return NextResponse.json(userOrders, { status: 200 });
  } catch (error: any) {
    console.error("Fetch User Orders Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}