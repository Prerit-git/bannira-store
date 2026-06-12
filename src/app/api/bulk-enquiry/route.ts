import { connectDB } from "@/lib/mongodb";
import BulkEnquiry from "@/models/BulkEnquiry";
import { NextResponse } from "next/server";
import { sendBulkEnquiryEmail } from "@/lib/bulkordermail";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    const { name, companyName, email, phone, gstNumber, items, message } = body;

    if (!name || !email || !phone || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Please fill all mandatory business profile inputs and select catalog items." },
        { status: 400 }
      );
    }

    const newLead = await BulkEnquiry.create({
      name,
      companyName,
      email,
      phone,
      gstNumber,
      items,
      message,
    });

    try {
      await sendBulkEnquiryEmail(process.env.ADMIN_RECEIVER_EMAIL || "prerit.dev@gmail.com", {
        enquiryId: newLead._id,
        name,
        companyName,
        email,
        phone,
        gstNumber,
        items,
        message,
      });
      console.log("✅ Custom B2B standalone mail triggered effortlessly.");
    } catch (mailError) {
      console.error("❌ Notification setup crashed, data stored safely in DB:", mailError);
    }

    return NextResponse.json(
      { success: true, message: "Wholesale query lead synchronized efficiently." },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Bulk Route Processing Failure Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}