import nodemailer from "nodemailer";
import { format } from "date-fns";

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

export interface InvoiceEmailParams {
  customerEmail: string;
  customerName: string;
  companyName: string;
  invoiceNumber: string;
  amount: number | null;
  currency: string;
  dueDate: string | null;
  notes: string | null;
  signedUrl: string;
  product: string;
  inquiryIdText: string;
}

export async function sendInvoiceAutomationEmail(params: InvoiceEmailParams): Promise<boolean> {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.warn(
      "[Email Utility] SMTP credentials are not set. Skipping client invoice automation email."
    );
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    const amountFormatted = params.amount != null
      ? `${params.currency} ${params.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
      : "To Be Discussed";

    const dueDateFormatted = params.dueDate
      ? format(new Date(params.dueDate), "dd MMM yyyy")
      : "Upon receipt";

    const mailOptions = {
      from: `"KL TRADERS Exports" <${user}>`,
      to: params.customerEmail,
      subject: `Invoice ${params.invoiceNumber} for your inquiry ${params.inquiryIdText} — KL TRADERS`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
          <div style="background-color: #0A2E1A; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px;">KL TRADERS</h1>
            <p style="color: #4ade80; margin: 5px 0 0 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Agricultural Exports — Invoice Review</p>
          </div>
          
          <div style="padding: 24px;">
            <p style="font-size: 15px; color: #2D3748; margin-top: 0;">Dear <strong>${params.customerName}</strong>,</p>
            <p style="font-size: 14px; color: #4A5568; line-height: 1.6;">
              We appreciate your interest and partnership with KL TRADERS. We have issued invoice <strong>${params.invoiceNumber}</strong> for your inquiry <strong>${params.inquiryIdText}</strong> regarding the export of <strong>${params.product}</strong>.
            </p>
            
            <div style="margin: 20px 0; padding: 18px; background-color: #F8FAF8; border-radius: 8px; border: 1px solid #E8F5E9;">
              <h3 style="margin: 0 0 12px 0; color: #114A2C; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Invoice Details</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #4A5568;">
                <tr>
                  <td style="padding: 5px 0; font-weight: bold; width: 120px;">Invoice Number</td>
                  <td style="padding: 5px 0; color: #114A2C; font-weight: bold;">${params.invoiceNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; font-weight: bold;">Total Amount</td>
                  <td style="padding: 5px 0; color: #2D3748; font-weight: bold;">${amountFormatted}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; font-weight: bold;">Due Date</td>
                  <td style="padding: 5px 0; color: #2D3748;">${dueDateFormatted}</td>
                </tr>
                ${params.notes ? `
                <tr>
                  <td style="padding: 5px 0; font-weight: bold; vertical-align: top;">Notes</td>
                  <td style="padding: 5px 0; color: #718096; line-height: 1.4;">${params.notes}</td>
                </tr>
                ` : ""}
              </table>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${params.signedUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 12px 30px; background-color: #1D6F42; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                Review & Download PDF
              </a>
              <p style="margin: 8px 0 0 0; font-size: 11px; color: #A0AEC0;">This link is secure and will remain valid for 30 days.</p>
            </div>
            
            <hr style="border: 0; border-top: 1px solid #EDF2F7; margin: 24px 0;" />
            
            <p style="font-size: 13px; color: #718096; line-height: 1.5; margin-bottom: 0;">
              Please review the document and proceed with the payment terms agreed. For any questions, custom packing requirements, or updates regarding this shipment, contact us directly via email or reply on WhatsApp at <strong>+91 6374791466</strong>.
            </p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; border-top: 1px solid #eee; font-size: 11px; color: #A0AEC0;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} KL TRADERS. All rights reserved.</p>
            <p style="margin: 4px 0 0 0;">Tamil Nadu, India | Premium Agricultural Products Exporter</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.info(`[Email Utility] Successfully sent invoice notification email to customer: ${params.customerEmail}`);
    return true;
  } catch (error) {
    console.error("[Email Utility] Error sending invoice automation email to client:", error);
    return false;
  }
}

export interface QuoteEmailParams {
  customerEmail: string;
  customerName: string;
  companyName: string;
  quoteNumber: string;
  amount: number | null;
  currency: string;
  validUntil: string | null;
  notes: string | null;
  signedUrl: string;
  product: string;
  inquiryIdText: string;
}

export async function sendQuoteAutomationEmail(params: QuoteEmailParams): Promise<boolean> {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.warn(
      "[Email Utility] SMTP credentials are not set. Skipping client quote automation email."
    );
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    const amountFormatted = params.amount != null
      ? `${params.currency} ${params.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
      : "To Be Discussed";

    const validUntilFormatted = params.validUntil
      ? format(new Date(params.validUntil), "dd MMM yyyy")
      : "To Be Discussed";

    const mailOptions = {
      from: `"KL TRADERS Exports" <${user}>`,
      to: params.customerEmail,
      subject: `Quote ${params.quoteNumber} for your inquiry ${params.inquiryIdText} — KL TRADERS`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
          <div style="background-color: #0A2E1A; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px;">KL TRADERS</h1>
            <p style="color: #4ade80; margin: 5px 0 0 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Agricultural Exports — Quote Review</p>
          </div>
          
          <div style="padding: 24px;">
            <p style="font-size: 15px; color: #2D3748; margin-top: 0;">Dear <strong>${params.customerName}</strong>,</p>
            <p style="font-size: 14px; color: #4A5568; line-height: 1.6;">
              Thank you for requesting a commercial quote from KL TRADERS. We have generated quote <strong>${params.quoteNumber}</strong> regarding your inquiry <strong>${params.inquiryIdText}</strong> for <strong>${params.product}</strong>.
            </p>
            
            <div style="margin: 20px 0; padding: 18px; background-color: #F8FAF8; border-radius: 8px; border: 1px solid #E8F5E9;">
              <h3 style="margin: 0 0 12px 0; color: #114A2C; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Quote Details</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #4A5568;">
                <tr>
                  <td style="padding: 5px 0; font-weight: bold; width: 120px;">Quote Number</td>
                  <td style="padding: 5px 0; color: #114A2C; font-weight: bold;">${params.quoteNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; font-weight: bold;">Estimated Total</td>
                  <td style="padding: 5px 0; color: #2D3748; font-weight: bold;">${amountFormatted}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; font-weight: bold;">Valid Until</td>
                  <td style="padding: 5px 0; color: #2D3748;">${validUntilFormatted}</td>
                </tr>
                ${params.notes ? `
                <tr>
                  <td style="padding: 5px 0; font-weight: bold; vertical-align: top;">Notes</td>
                  <td style="padding: 5px 0; color: #718096; line-height: 1.4;">${params.notes}</td>
                </tr>
                ` : ""}
              </table>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${params.signedUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 12px 30px; background-color: #1D6F42; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                Review & Download PDF
              </a>
              <p style="margin: 8px 0 0 0; font-size: 11px; color: #A0AEC0;">This link is secure and will remain valid for 30 days.</p>
            </div>
            
            <hr style="border: 0; border-top: 1px solid #EDF2F7; margin: 24px 0;" />
            
            <p style="font-size: 13px; color: #718096; line-height: 1.5; margin-bottom: 0;">
              If you wish to accept this quote, please reply to this email or contact us on WhatsApp at <strong>+91 6374791466</strong> to finalize the shipment schedule and receive the invoice.
            </p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; border-top: 1px solid #eee; font-size: 11px; color: #A0AEC0;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} KL TRADERS. All rights reserved.</p>
            <p style="margin: 4px 0 0 0;">Tamil Nadu, India | Premium Agricultural Products Exporter</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.info(`[Email Utility] Successfully sent quote notification email to customer: ${params.customerEmail}`);
    return true;
  } catch (error) {
    console.error("[Email Utility] Error sending quote automation email to client:", error);
    return false;
  }
}
