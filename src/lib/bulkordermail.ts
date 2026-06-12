import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

export async function sendBulkEnquiryEmail(adminEmail: string, enquiryDetails: any) {
  const { enquiryId, name, companyName, email, phone, gstNumber, items, message } = enquiryDetails;

  const itemsHtml = items.map((item: any) => `
    <div style="display: inline-block; width: 140px; margin: 10px; text-align: center; font-family: sans-serif; border: 1px solid #f0f0f0; padding: 12px; border-radius: 16px; background: #fafafa;">
      <img src="${item.image}" alt="${item.name}" style="width: 110px; height: 145px; object-fit: cover; border-radius: 12px;" />
      <p style="font-size: 11px; font-weight: bold; margin: 8px 0 4px 0; color: #1a1a1a; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 32px; line-height: 16px;">
        ${item.name}
      </p>
      <p style="font-size: 10px; color: #7B2D0A; font-weight: bold; margin: 0;">MRP: ₹${item.price.toLocaleString("en-IN")}</p>
    </div>
  `).join("");

  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e8e8e8; border-radius: 24px; background-color: #FAF9F6; color: #1A1A1A;">
      
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="font-family: serif; color: #7B2D0A; font-style: italic; font-size: 28px; margin: 0; letter-spacing: 2px;">BANNIRA</h2>
        <p style="font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 3px; color: #D4AF37; margin: 5px 0 0 0;">Wholesale Portal</p>
      </div>

      <div style="background: white; border: 1px solid #f0f0f0; padding: 25px; border-radius: 20px; margin-bottom: 25px; box-shadow: 0 4px 12px rgba(0,0,0,0.01);">
        <h3 style="margin-top: 0; color: #7B2D0A; font-size: 14px; border-bottom: 1px solid #f5f5f5; padding-bottom: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">
          Client Information
        </h3>
        <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 13px; color: #4a4a4a; font-family: sans-serif;">
          <tr><td width="35%"><strong>Enquiry ID:</strong></td><td><span style="font-family: monospace; font-weight: bold; color: #1a1a1a;">#${enquiryId}</span></td></tr>
          <tr><td><strong>Contact Person:</strong></td><td style="color: #1a1a1a; font-weight: bold;">${name}</td></tr>
          <tr><td><strong>Company Name:</strong></td><td>${companyName || "Individual Buyer"}</td></tr>
          <tr><td><strong>WhatsApp Mobile:</strong></td><td><a href="https://wa.me/91${phone}" style="color: #7B2D0A; font-weight: bold; text-decoration: none;">+91 ${phone} 🟢 (Tap to Chat)</a></td></tr>
          <tr><td><strong>Business Email:</strong></td><td><a href="mailto:${email}" style="color: #4a4a4a; text-decoration: none;">${email}</a></td></tr>
          <tr><td><strong>Corporate GSTIN:</strong></td><td style="font-family: monospace; color: #D4AF37; font-weight: bold; text-transform: uppercase;">${gstNumber || "Not Provided"}</td></tr>
        </table>
      </div>

      <div style="background: white; border: 1px solid #f0f0f0; padding: 25px; border-radius: 20px; margin-bottom: 25px;">
        <h4 style="margin-top: 0; color: #1a1a1a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">Requirement Specifications Note:</h4>
        <p style="font-size: 13px; color: #555; line-height: 1.6; font-style: italic; background: #fafafa; padding: 15px; border-radius: 12px; margin: 0; border-left: 3px solid #D4AF37;">
          "${message || "No specific dynamic scaling or customization variants notes added by buyer."}"
        </p>
      </div>

      <div style="background: white; border: 1px solid #f0f0f0; padding: 25px; border-radius: 20px;">
        <h4 style="margin-top: 0; color: #1a1a1a; font-size: 12px; text-transform: uppercase; margin-bottom: 15px; letter-spacing: 0.5px;">
          Requested Sample Catalog Designs (${items.length} Items Selected)
        </h4>
        <div style="text-align: center; background: #ffffff;">
          ${itemsHtml}
        </div>
      </div>

      <p style="text-align: center; font-size: 9px; color: #999; margin-top: 35px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">
         Bannira
      </p>
    </div>
  `;

  return await transporter.sendMail({
    from: `"Bannira Wholesale" <${process.env.MAIL_USER}>`,
    to: adminEmail,
    subject: `🚨 [BULK ORDER] New Wholesale Query: ${companyName || name}`,
    html: emailHtml,
  });
}