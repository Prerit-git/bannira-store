import nodemailer from "nodemailer";

export const sendOrderEmail = async (email: string, orderDetails: any) => {
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

  const { orderId, total, items, address } = orderDetails;

  const itemsHtml = items.map((item: any) => `
    <tr>
      <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="70">
              <img src="${item.image}" alt="${item.name}" width="60" style="border-radius: 8px; display: block;" />
            </td>
            <td style="padding-left: 15px;">
              <p style="margin: 0; font-size: 14px; color: #1C1C1C; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">${item.name}</p>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #888; text-transform: uppercase;">Size: ${item.size} | Qty: ${item.quantity}</p>
            </td>
            <td align="right" style="font-size: 14px; font-weight: bold; color: #7B2D0A;">
              ₹${(item.price * item.quantity).toLocaleString()}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join("");

  const mailOptions = {
    from: '"Bannira Store" <prerit.dev@gmail.com>',
    to: email,
    subject: `Order Successfully Placed: Order #${orderId.toString().slice(-6).toUpperCase()}`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #1C1C1C;">
        
        <div style="background-color: #1C1C1C; padding: 50px 20px; text-align: center;">
          <h1 style="color: #D4AF37; margin: 0; font-family: 'Georgia', serif; font-size: 32px; letter-spacing: 6px; text-transform: uppercase; font-weight: 400;">Bannira</h1>
          <div style="width: 40px; height: 1px; background-color: #D4AF37; margin: 15px auto;"></div>
          <p style="color: #ffffff; font-size: 10px; letter-spacing: 3px; margin: 0; opacity: 0.7; text-transform: uppercase;">Culture in Color, Style in Spirit</p>
        </div>

        <div style="padding: 40px 30px;">
          <h2 style="color: #1C1C1C; font-size: 22px; margin-bottom: 10px; font-weight: 300; font-family: 'Georgia', serif; font-style: italic;">Order Confirmation</h2>
          <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
            Dear ${address.fullName}, <br><br>
            Your order is confirmed! Our team is now carefully preparing your items to make sure everything is perfect. We will send you another email as soon as your package is on its way.
          </p>

          <div style="background-color: #FAF9F6; border: 1px solid #f0e8db; padding: 25px; border-radius: 12px; margin-bottom: 35px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Order Id</td>
                <td align="right" style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Date</td>
              </tr>
              <tr>
                <td style="color: #1C1C1C; font-size: 14px; font-weight: bold; padding-top: 5px;">#${orderId.toString().toUpperCase()}</td>
                <td align="right" style="color: #1C1C1C; font-size: 14px; font-weight: bold; padding-top: 5px;">${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
              </tr>
            </table>
          </div>

          <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #1C1C1C; border-bottom: 2px solid #1C1C1C; padding-bottom: 8px; margin-bottom: 10px;">Your Selection</h3>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${itemsHtml}
            <tr>
              <td colspan="2" style="padding-top: 20px; font-size: 14px; color: #888; text-transform: uppercase;">Total Paid (with GST)</td>
              <td align="right" style="padding-top: 20px; font-size: 18px; font-weight: bold; color: #1C1C1C;">₹${total.toLocaleString()}</td>
            </tr>
          </table>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td valign="top" width="50%">
                  <h4 style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 10px;">Shipping To</h4>
                  <p style="color: #1C1C1C; font-size: 13px; line-height: 1.5; margin: 0;">
                    <b>${address.fullName}</b><br>
                    ${address.address}, ${address.area}<br>
                    ${address.state} - ${address.pincode}<br>
                    T: ${address.phone}
                  </p>
                </td>
                <td valign="top" width="50%" align="right">
                  <h4 style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 10px;">Shipping Method</h4>
                  <p style="color: #1C1C1C; font-size: 13px; margin: 0;">Standard Insured Delivery<br>(3-5 Business Days)</p>
                </td>
              </tr>
            </table>
          </div>

          <div style="margin-top: 50px; text-align: center;">
            <a href="https://bannira-store.netlify.app/profile/orders" style="background-color: #1C1C1C; color: #D4AF37; padding: 18px 35px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 11px; letter-spacing: 2px; display: inline-block; text-transform: uppercase; border: 1px solid #D4AF37;">Track Your Order</a>
          </div>
        </div>

        <div style="background-color: #FAF9F6; padding: 40px 20px; text-align: center; border-top: 1px solid #eee;">
          <p style="color: #1C1C1C; font-family: serif; font-size: 16px; letter-spacing: 2px; margin-bottom: 10px;">BANNIRA</p>
          <p style="color: #999; font-size: 11px; line-height: 1.6; margin: 0;">
            This is an automated message from the Bannira Team. <br>
            Please do not reply to this email. For any assistance, contact support.
          </p>
          <p style="color: #999; font-size: 11px; margin-top: 20px;">&copy; 2026 Bannira Store, India.</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Confirmation Email sent: " + info.response);
    return { success: true };
  } catch (error) {
    console.error("❌ Email failed: ", error);
    return { success: false, error };
  }
};