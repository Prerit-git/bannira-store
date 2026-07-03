// import { connectDB } from "@/lib/mongodb";
// import Order from "@/models/Order";
// import Product from "@/models/Product";
// import { NextResponse } from "next/server";
// import { sendOrderEmail } from "@/lib/mail";
// import { revalidatePath } from "next/cache";
// import crypto from "crypto";

// export async function POST(req: Request) {
//   try {
//     await connectDB();
//     const body = await req.json();
//     const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

//     // 1. Signature Verification
//     const sign = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSign = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
//       .update(sign.toString())
//       .digest("hex");
    
//     if (expectedSign !== razorpay_signature) {
//         return NextResponse.json({ error: "Payment verification failed. Genuine signature mismatch." }, { status: 400 });
//     }
    
//     const checkOrder = await Order.findById(orderId);
//     if (!checkOrder) {
//         return NextResponse.json({ error: "Order context reference not found" }, { status: 404 });
//     }
//     const customerEmail = checkOrder.userEmail || checkOrder.shippingAddress?.email;

//     const updatedOrder = await Order.findByIdAndUpdate(
//       orderId,
//       {
//         $set: {
//           paymentStatus: "Paid",
//           orderStatus: "Processing",
//           razorpayPaymentId: razorpay_payment_id
//         }
//       },
//       { new: true }
//     );

//     if (!updatedOrder) {
//       return NextResponse.json({ error: "Failed to update the order state." }, { status: 500 });
//     }

//     // 🔥 FIXED: Loop through items and decrement global AND specific size stock for online payments
//     // 🔥 FIXED & SAFE: Loop through items and decrement global AND specific size stock for online payments
//     const updatePromises = updatedOrder.items.map((item: any) => {
//       const targetProductId = item.productId;
//       const purchasedSize = item.size; // e.g., "S", "M", "L"
//       const purchasedQty = Number(item.quantity);

//       if (!purchasedSize) {
//         console.error(`❌ Size missing for item in order verification loop: ${item.name}`);
//         return Promise.resolve(); // Safe skip to prevent crash
//       }

//       // 🔥 Path targeting the dynamic size inside Mongoose Map/Object structure strictly
//       const sizeFieldPath = `sizeVariants.${purchasedSize}`;

//       return Product.findByIdAndUpdate(
//         targetProductId,
//         { 
//           $inc: { 
//             quantity: -purchasedQty,
//             [sizeFieldPath]: -purchasedQty
//           } 
//         },
//         { new: true }
//       );
//     });
    
//     await Promise.all(updatePromises);

//     // 4. Safe Email Dispatch Flow
//     if (!customerEmail) {
//       console.error("❌ Cannot send email: Customer email is missing in order document.");
//     } else {
//       try {
//         await sendOrderEmail(customerEmail, {
//           orderId: updatedOrder._id,
//           total: updatedOrder.totalAmount,
//           items: updatedOrder.items,
//           address: updatedOrder.shippingAddress
//         });
//         console.log(`✅ Online Paid Confirmation email sent to: ${customerEmail}`);
//       } catch (mailError) {
//         console.error("❌ Email failed but payment was completed:", mailError);
//       }
//     }

//     revalidatePath('/products');

//     // Return the safely updated order document reference
//     return NextResponse.json({ 
//       success: true, 
//       order: updatedOrder 
//     }, { status: 200 });

//   } catch (error: any) {
//     console.error("Verification Route Error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { sendOrderEmail } from "@/lib/mail";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

const ITHINK_STORE_ID = process.env.ITHINK_STORE_ID;
const ITHINK_ACCESS_TOKEN = process.env.ITHINK_ACCESS_TOKEN;
const ITHINK_SECRET_KEY = process.env.ITHINK_SECRET_KEY;
// const ITHINK_API_URL = process.env.ITHINK_API_URL || "https://my.ithinklogistics.com/api_v3";
// const ITHINK_API_URL = process.env.ITHINK_API_URL || "https://pre-alpha.ithinklogistics.com/api_v3";
const ITHINK_API_URL = process.env.ITHINK_API_URL || "";

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

    // Loop through items and decrement global AND specific size stock for online payments
    const updatePromises = updatedOrder.items.map((item: any) => {
      const targetProductId = item.productId;
      const purchasedSize = item.size; 
      const purchasedQty = Number(item.quantity);

      if (!purchasedSize) {
        console.error(`❌ Size missing for item in order verification loop: ${item.name}`);
        return Promise.resolve(); 
      }

      const sizeFieldPath = `sizeVariants.${purchasedSize}`;

      return Product.findByIdAndUpdate(
        targetProductId,
        { 
          $inc: { 
            quantity: -purchasedQty,
            [sizeFieldPath]: -purchasedQty
          } 
        },
        { new: true }
      );
    });
    
    await Promise.all(updatePromises);

    try {
      console.log("🚚 Initiating iThink Logistics order sync for:", updatedOrder._id);

      // const ithinkPayload = {
      //   data: {
      //     store_id: String(ITHINK_STORE_ID || "").trim(),
      //     // access_token: String(ITHINK_ACCESS_TOKEN || "").trim(),
      //     access_token: "637519d8d068259b3159e4ca67816af8",
      //     // secret_key: String(ITHINK_SECRET_KEY || "").trim(),
      //     secret_key: "43e7a603ad248213b3f98c72c7419f24",
      //     pickup_address_id: Number(process.env.ITHINK_PICKUP_CODE) || 92003,
      //     logistics: "Choose For Me",
      //     s_type: "Domestic",
          
      //     shipments: [
      //       {
      //         order: `BNR-${updatedOrder._id.toString().slice(-6).toUpperCase()}`,
      //         payment_mode: "Prepaid",
      //         total_amount: updatedOrder.totalAmount,
      //         consignee_name: updatedOrder.shippingAddress?.fullName || "Bannira Customer",
      //         consignee_phone: updatedOrder.shippingAddress?.phone || "0000000000",
      //         consignee_address: updatedOrder.shippingAddress?.address || "Address details",
      //         consignee_pincode: updatedOrder.shippingAddress?.pincode || "",
      //         consignee_city: updatedOrder.shippingAddress?.city || "",
      //         consignee_state: updatedOrder.shippingAddress?.state || "",
      //         weight: 0.5,
      //         products: updatedOrder.items.map((item: any) => ({
      //           product_name: item.name,
      //           product_quantity: item.quantity,
      //           product_price: item.price
      //         }))
      //       }
      //     ]
      //   }
      // };

      // ─── 🔥 STRICT DUMMY PAYLOAD MIRROR MATCH ───
      
      const ithinkPayload = {
        data: {
          store_id: String(ITHINK_STORE_ID || "").trim(),
          access_token: String(ITHINK_ACCESS_TOKEN || "").trim(),
          secret_key: String(ITHINK_SECRET_KEY || "").trim(),

          pickup_address_id: String(process.env.ITHINK_PICKUP_CODE || "92003"),
          logistics: "Delhivery",
          s_type: "",
          order_type: "",

          shipments: [
            {
              waybill: "",
              order: `BNR-${updatedOrder._id.toString().slice(-6).toUpperCase()}`,
              sub_order: "A",
              order_date: new Date()
                .toLocaleDateString("en-GB")
                .replace(/\//g, "-"),
              // total_amount: String(updatedOrder.totalAmount),
              total_amount: String(
                (
                  Number(updatedOrder.totalAmount || 0) +
                  Number(updatedOrder.tax || 0) -
                  Number(updatedOrder.discount || 0)
                ).toFixed(2),
              ),

              // Consignee Shipping Details
              name:
                updatedOrder.shippingAddress?.fullName || "Bannira Customer",
              company_name: "",
              add: updatedOrder.shippingAddress?.address || "Address details",
              add2: "",
              add3: "",
              pin: String(updatedOrder.shippingAddress?.pincode || ""),
              city: updatedOrder.shippingAddress?.city || "",
              state: updatedOrder.shippingAddress?.state || "",
              country: "India",
              phone: String(
                updatedOrder.shippingAddress?.phone || "0000000000",
              ),
              alt_phone: String(
                updatedOrder.shippingAddress?.phone || "0000000000",
              ),
              email: customerEmail || "abc@gmail.com",

              is_billing_same_as_shipping: "yes",
              billing_name:
                updatedOrder.shippingAddress?.fullName || "Bannira Customer",
              billing_company_name: "",
              billing_add:
                updatedOrder.shippingAddress?.address || "Address details",
              billing_add2: "",
              billing_add3: "",
              billing_pin: String(updatedOrder.shippingAddress?.pincode || ""),
              billing_city: updatedOrder.shippingAddress?.city || "",
              billing_state: updatedOrder.shippingAddress?.state || "",
              billing_country: "India",
              billing_phone: String(
                updatedOrder.shippingAddress?.phone || "0000000000",
              ),
              billing_alt_phone: String(
                updatedOrder.shippingAddress?.phone || "0000000000",
              ),
              billing_email: customerEmail || "abc@gmail.com",

              // Products Matrix Mapping array
              products: updatedOrder.items.map((item: any) => ({
                product_name: item.name,
                product_sku:
                  item.productId?.toString().slice(-6) || "SKU-DEFAULT",
                product_quantity: String(item.quantity),
                product_price: String(item.price),
                product_tax_rate: "0",
                product_hsn_code: "",
                product_discount: "0",
                product_img_url: String(item.image) || "",
              })),

              shipment_length: "10",
              shipment_width: "10",
              shipment_height: "5",
              weight: "0.5",
              shipping_charges: "0",
              giftwrap_charges: "0",
              transaction_charges: "0",
              total_discount: "0",
              first_attemp_discount: "0",
              cod_charges: "0",
              advance_amount: "0",
              cod_amount: "0",
              payment_mode: "Prepaid",
              reseller_name: "",
              eway_bill_number: "",
              gst_number: "",
              what3words: "",
              return_address_id: String(
                process.env.ITHINK_PICKUP_CODE || "92003",
              ),
            },
          ],
        },
      };

      const ithinkRes = await fetch(`${ITHINK_API_URL.replace(/\/$/, "")}/order/add.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ithinkPayload)
      });

      const logisticsData = await ithinkRes.json();

      if (logisticsData.status === "success" || logisticsData.status === "1") {
        const generatedAwb = logisticsData.data?.shipments?.[0]?.awb_number;
        
        // Push logistics references back to our original MongoDB Order Document
        await Order.findByIdAndUpdate(updatedOrder._id, {
          $set: {
            awbNumber: generatedAwb || "",
            shippingStatus: "Manifested", // Sets system status to ready for package handover
            logisticsLog: logisticsData.data
          }
        });
        console.log(`🚀 iThink Logistics synchronized! AWB Number Assigned: ${generatedAwb}`);
      } else {
        console.warn("⚠️ iThink Validation Warning:", logisticsData.msg || "Payload criteria discrepancy");

        console.log("🔍 ACTUAL ITHINK ERROR DATA:", JSON.stringify(logisticsData, null, 2));
        await Order.findByIdAndUpdate(updatedOrder._id, {
          $set: { logisticsErrorLog: logisticsData.msg || "Validation Failed" }
        });
      }
    } catch (logisticsError) {
      console.error("Critical non-blocking exception handled inside iThink logistics mapping:", logisticsError);
    }

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