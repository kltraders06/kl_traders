import nodemailer from "nodemailer";

export interface EmailParams {
  inquiryId: string;
  fullName: string;
  companyName: string;
  country: string;
  email: string;
  whatsapp?: string | null;
  preferredComm: string;
  product: string;
  quantity?: string | null;
  inquiryType: string;
  message?: string | null;
}

export async function sendInquiryEmail(params: EmailParams): Promise<boolean> {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.SMTP_TO || "kltraders06@gmail.com";

  if (!user || !pass) {
    console.warn(
      "[Email Utility] SMTP credentials (SMTP_USER/SMTP_PASS) are not set. Skipping inquiry email notification."
    );
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports like 587
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from: `"KL TRADERS Inquiry System" <${user}>`,
      to,
      subject: `[New Inquiry] ${params.inquiryId} — ${params.companyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
          <div style="background-color: #0A2E1A; padding: 15px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px;">KL TRADERS</h1>
            <p style="color: #4ade80; margin: 5px 0 0 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">New Inquiry Notification</p>
          </div>
          
          <div style="padding: 20px;">
            <p style="font-size: 14px; color: #666; margin-top: 0;">A new buyer inquiry has been received from the public website contact form.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 8px 0; font-weight: bold; color: #555; width: 160px; font-size: 13px;">Inquiry ID</td>
                <td style="padding: 8px 0; font-family: monospace; color: #1D6F42; font-weight: bold; font-size: 14px;">${params.inquiryId}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 8px 0; font-weight: bold; color: #555; font-size: 13px;">Company Name</td>
                <td style="padding: 8px 0; color: #222; font-weight: 600; font-size: 13px;">${params.companyName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 8px 0; font-weight: bold; color: #555; font-size: 13px;">Client Name</td>
                <td style="padding: 8px 0; color: #333; font-size: 13px;">${params.fullName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 8px 0; font-weight: bold; color: #555; font-size: 13px;">Country</td>
                <td style="padding: 8px 0; color: #333; font-size: 13px;">${params.country}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 8px 0; font-weight: bold; color: #555; font-size: 13px;">Email Address</td>
                <td style="padding: 8px 0; color: #0066cc; font-size: 13px;"><a href="mailto:${params.email}">${params.email}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 8px 0; font-weight: bold; color: #555; font-size: 13px;">WhatsApp Number</td>
                <td style="padding: 8px 0; color: #333; font-size: 13px;">${params.whatsapp || "Not provided"}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 8px 0; font-weight: bold; color: #555; font-size: 13px;">Preferred Channel</td>
                <td style="padding: 8px 0; color: #333; font-size: 13px;">${params.preferredComm}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 8px 0; font-weight: bold; color: #555; font-size: 13px;">Product of Interest</td>
                <td style="padding: 8px 0; color: #114A2C; font-weight: bold; font-size: 13px;">${params.product}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 8px 0; font-weight: bold; color: #555; font-size: 13px;">Quantity Required</td>
                <td style="padding: 8px 0; color: #333; font-size: 13px;">${params.quantity || "Not specified"}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 8px 0; font-weight: bold; color: #555; font-size: 13px;">Inquiry Type</td>
                <td style="padding: 8px 0; color: #333; font-size: 13px;">${params.inquiryType}</td>
              </tr>
            </table>

            ${
              params.message
                ? `
              <div style="margin-top: 20px; padding: 15px; background-color: #F8FAF8; border-radius: 8px; border-left: 4px solid #1D6F42;">
                <h4 style="margin: 0 0 8px 0; color: #114A2C; font-size: 13px;">Additional Requirements / Message:</h4>
                <p style="margin: 0; color: #444; font-size: 13px; line-height: 1.5; white-space: pre-wrap;">${params.message}</p>
              </div>
            `
                : ""
            }
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; border-top: 1px solid #eee;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://kltraders.in"}/admin" style="display: inline-block; padding: 10px 20px; background-color: #1D6F42; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 13px;">Open Admin Panel</a>
            <p style="margin: 12px 0 0 0; font-size: 11px; color: #888;">This is an automated notification. Please reply directly to the customer's email.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.info(`[Email Utility] Successfully sent inquiry email for ${params.inquiryId} to ${to}`);
    return true;
  } catch (error) {
    console.error("[Email Utility] Error sending inquiry notification email:", error);
    return false;
  }
}
