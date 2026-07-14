import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateQuoteNumber, generateInvoiceNumber } from "@/lib/admin-utils";
import { sendQuoteAutomationEmail, sendInvoiceAutomationEmail } from "@/lib/email";
import { jsPDF } from "jspdf";
import type { ApiResponse } from "@/types";

// POST /api/admin/upload
// Multipart form fields:
//   file        — the PDF file
//   type        — "quote" | "invoice"
//   inquiry_id  — UUID of the inquiry
//   quote_id    — UUID of quote (required when type = "invoice")
//   amount      — optional numeric amount
//   currency    — optional, defaults to USD
//   valid_until — optional date string (quotes)
//   due_date    — optional date string (invoices)
//   notes       — optional text
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file       = form.get("file") as File | null;
    const type       = form.get("type") as "quote" | "invoice";
    const inquiryId  = form.get("inquiry_id") as string;
    const quoteId    = form.get("quote_id") as string | null;
    const amount     = form.get("amount") ? parseFloat(form.get("amount") as string) : null;
    const currency   = (form.get("currency") as string) || "USD";
    const validUntil = form.get("valid_until") as string | null;
    const dueDate    = form.get("due_date") as string | null;
    const notes      = form.get("notes") as string | null;

    const generateAuto = form.get("generate_auto") === "true";
    const unitPrice    = form.get("unit_price") ? parseFloat(form.get("unit_price") as string) : 0;
    const shipping     = form.get("shipping") ? parseFloat(form.get("shipping") as string) : 0;

    if (!type || !inquiryId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "type and inquiry_id are required." },
        { status: 400 }
      );
    }

    if (!["quote", "invoice"].includes(type)) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'type must be "quote" or "invoice".' },
        { status: 400 }
      );
    }

    if (!generateAuto) {
      if (!file) {
        return NextResponse.json<ApiResponse<never>>(
          { success: false, error: "file is required." },
          { status: 400 }
        );
      }
      if (file.type !== "application/pdf") {
        return NextResponse.json<ApiResponse<never>>(
          { success: false, error: "Only PDF files are accepted." },
          { status: 400 }
        );
      }
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json<ApiResponse<never>>(
          { success: false, error: "File size must be under 10 MB." },
          { status: 400 }
        );
      }
    }

    const bucket = type === "quote" ? "quotes" : "invoices";
    const number  = type === "quote"
      ? await generateQuoteNumber()
      : await generateInvoiceNumber();

    // Build storage path: {inquiryId}/{number}.pdf
    const filePath = `${inquiryId}/{number}.pdf`;
    let buffer: Buffer;
    let fileName: string;
    let customer: any = null;

    if (generateAuto) {
      // Get customer/inquiry details
      const { data, error: customerErr } = await supabaseAdmin
        .from("inquiries_with_customers")
        .select("*")
        .eq("id", inquiryId)
        .single();

      if (customerErr || !data) {
        throw new Error("Failed to fetch inquiry customer details for PDF generation.");
      }
      customer = data;

      const dateVal = type === "quote" 
        ? (validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()) 
        : (dueDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString());

      buffer = generateDocumentPDF({
        type,
        number,
        inquiryIdText: customer.inquiry_id,
        customerName: customer.full_name,
        companyName: customer.company_name,
        country: customer.country,
        email: customer.email,
        product: customer.product,
        quantity: customer.quantity || "1",
        unitPrice,
        currency,
        shipping,
        dueDateOrValidUntil: dateVal,
        notes: notes || "",
      });
      fileName = `${type}_${number}.pdf`;
    } else {
      buffer = Buffer.from(await file!.arrayBuffer());
      fileName = file!.name;
    }

    const { error: uploadErr } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadErr) throw uploadErr;

    // Compute amount if generated automatically
    let calculatedAmount = amount;
    if (generateAuto && customer) {
      const parsedQty = parseFloat(customer.quantity?.replace(/[^\d.]/g, "") || "1") || 1;
      calculatedAmount = parsedQty * unitPrice + shipping;
    }

    // Insert DB record
    if (type === "quote") {
      const { data, error } = await supabaseAdmin
        .from("quotes")
        .insert({
          inquiry_id:   inquiryId,
          quote_number: number,
          file_path:    filePath,
          file_name:    fileName,
          total_amount: calculatedAmount,
          currency,
          valid_until:  validUntil || null,
          notes:        notes || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Auto-update inquiry status to "quoted"
      await supabaseAdmin
        .from("inquiries")
        .update({ status: "quoted" })
        .eq("id", inquiryId);

      // Email automation: send quote to client (non-blocking)
      (async () => {
        try {
          const { data: customerData } = await supabaseAdmin
            .from("inquiries_with_customers")
            .select("*")
            .eq("id", inquiryId)
            .single();

          if (customerData?.email) {
            const { data: signedUrlData } = await supabaseAdmin.storage
              .from("quotes")
              .createSignedUrl(filePath, 60 * 60 * 24 * 30);

            if (signedUrlData?.signedUrl) {
              await sendQuoteAutomationEmail({
                customerEmail: customerData.email,
                customerName: customerData.full_name,
                companyName: customerData.company_name,
                quoteNumber: number,
                amount: calculatedAmount,
                currency,
                validUntil: validUntil || null,
                notes: notes || null,
                signedUrl: signedUrlData.signedUrl,
                product: customerData.product,
                inquiryIdText: customerData.inquiry_id,
              });
            }
          }
        } catch (e) {
          console.error("[Upload Route] Quote email automation failed:", e);
        }
      })();

      return NextResponse.json<ApiResponse<typeof data>>({ success: true, data });
    } else {
      const { data, error } = await supabaseAdmin
        .from("invoices")
        .insert({
          inquiry_id:     inquiryId,
          quote_id:       quoteId || null,
          invoice_number: number,
          file_path:      filePath,
          file_name:      fileName,
          amount:         calculatedAmount,
          currency,
          due_date:       dueDate || null,
          notes:          notes || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Email automation: send invoice to client (non-blocking)
      (async () => {
        try {
          const { data: customerData } = await supabaseAdmin
            .from("inquiries_with_customers")
            .select("*")
            .eq("id", inquiryId)
            .single();

          if (customerData?.email) {
            const { data: signedUrlData } = await supabaseAdmin.storage
              .from("invoices")
              .createSignedUrl(filePath, 60 * 60 * 24 * 30);

            if (signedUrlData?.signedUrl) {
              await sendInvoiceAutomationEmail({
                customerEmail: customerData.email,
                customerName: customerData.full_name,
                companyName: customerData.company_name,
                invoiceNumber: number,
                amount: calculatedAmount,
                currency,
                dueDate: dueDate || null,
                notes: notes || null,
                signedUrl: signedUrlData.signedUrl,
                product: customerData.product,
                inquiryIdText: customerData.inquiry_id,
              });
            }
          }
        } catch (e) {
          console.error("[Upload Route] Invoice email automation failed:", e);
        }
      })();

      return NextResponse.json<ApiResponse<typeof data>>({ success: true, data });
    }
  } catch (err) {
    console.error("[POST /api/admin/upload]", err);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}

function generateDocumentPDF({
  type,
  number,
  inquiryIdText,
  customerName,
  companyName,
  country,
  email,
  product,
  quantity,
  unitPrice,
  currency,
  shipping,
  dueDateOrValidUntil,
  notes,
}: {
  type: "quote" | "invoice";
  number: string;
  inquiryIdText: string;
  customerName: string;
  companyName: string;
  country: string;
  email: string;
  product: string;
  quantity: string;
  unitPrice: number;
  currency: string;
  shipping: number;
  dueDateOrValidUntil: string;
  notes: string;
}): Buffer {
  const doc = new jsPDF();
  
  // Brand Header
  doc.setFillColor(10, 46, 26); // #0A2E1A dark green
  doc.rect(0, 0, 210, 40, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("KL TRADERS", 20, 22);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(74, 222, 128); // light green
  doc.text("PREMIUM AGRICULTURAL EXPORTS FROM INDIA", 20, 29);
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("Email: kltraders06@gmail.com | Phone: +91 6374791466", 115, 20);
  doc.text("Tamil Nadu, India | www.kltraders.in", 143, 26);

  // Document Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(17, 74, 66); // primary color
  const title = type.toUpperCase();
  doc.text(title, 20, 55);
  
  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(20, 60, 190, 60);

  // Details
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("Document #:", 120, 52);
  doc.text("Inquiry ID:", 120, 58);
  doc.text("Date:", 120, 64);
  const dateLabel = type === "quote" ? "Valid Until:" : "Due Date:";
  doc.text(dateLabel, 120, 70);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(33, 37, 41);
  doc.text(number, 150, 52);
  doc.text(inquiryIdText, 150, 58);
  doc.text(new Date().toLocaleDateString(), 150, 64);
  doc.text(new Date(dueDateOrValidUntil).toLocaleDateString(), 150, 70);

  // Customer Details
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(17, 74, 66);
  doc.text("CLIENT DETAILS", 20, 78);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(33, 37, 41);
  doc.text(`Company: ${companyName}`, 20, 84);
  doc.text(`Contact: ${customerName}`, 20, 90);
  doc.text(`Country: ${country}`, 20, 96);
  doc.text(`Email: ${email}`, 20, 102);

  // Table Headers
  doc.setFillColor(248, 250, 248);
  doc.rect(20, 112, 170, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(17, 74, 66);
  doc.text("Description", 22, 117);
  doc.text("Quantity", 95, 117);
  doc.text("Unit Price", 130, 117);
  doc.text("Total", 165, 117);

  // Divider
  doc.line(20, 120, 190, 120);

  // Table Content
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  doc.text(product, 22, 128);
  doc.text(quantity, 95, 128);
  
  const unitPriceFormatted = `${currency} ${unitPrice.toFixed(2)}`;
  doc.text(unitPriceFormatted, 130, 128);
  
  const parsedQty = parseFloat(quantity.replace(/[^\d.]/g, "")) || 1;
  const lineTotal = parsedQty * unitPrice;
  const lineTotalFormatted = `${currency} ${lineTotal.toFixed(2)}`;
  doc.text(lineTotalFormatted, 165, 128);

  doc.line(20, 134, 190, 134);

  // Totals calculations
  const subtotal = lineTotal;
  const total = subtotal + shipping;

  doc.setFont("helvetica", "normal");
  doc.text("Subtotal:", 130, 142);
  doc.text("Shipping & Freight:", 130, 148);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(17, 74, 66);
  doc.text("Grand Total:", 130, 154);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  doc.text(`${currency} ${subtotal.toFixed(2)}`, 165, 142);
  doc.text(`${currency} ${shipping.toFixed(2)}`, 165, 148);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(17, 74, 66);
  doc.text(`${currency} ${total.toFixed(2)}`, 165, 154);

  // Notes
  if (notes) {
    doc.setDrawColor(241, 245, 249);
    doc.setFillColor(250, 250, 250);
    doc.rect(20, 165, 170, 25, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("NOTES & INSTRUCTIONS", 24, 171);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    const splitNotes = doc.splitTextToSize(notes, 160);
    doc.text(splitNotes, 24, 177);
  }

  // Footer Brand
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(17, 74, 66);
  doc.text("Thank you for choosing KL TRADERS as your agricultural partner!", 20, 205);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("This is an automatically generated commercial document.", 20, 212);

  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}
