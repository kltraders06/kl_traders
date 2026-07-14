import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateQuoteNumber, generateInvoiceNumber } from "@/lib/admin-utils";
import { sendQuoteAutomationEmail, sendInvoiceAutomationEmail } from "@/lib/email";
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

    if (!file || !type || !inquiryId) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "file, type, and inquiry_id are required." },
        { status: 400 }
      );
    }

    if (!["quote", "invoice"].includes(type)) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'type must be "quote" or "invoice".' },
        { status: 400 }
      );
    }

    // Enforce PDF only
    if (file.type !== "application/pdf") {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Only PDF files are accepted." },
        { status: 400 }
      );
    }

    // 10 MB limit
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "File size must be under 10 MB." },
        { status: 400 }
      );
    }

    const bucket = type === "quote" ? "quotes" : "invoices";
    const number  = type === "quote"
      ? await generateQuoteNumber()
      : await generateInvoiceNumber();

    // Build storage path: {inquiryId}/{number}.pdf
    const filePath = `${inquiryId}/${number}.pdf`;
    const buffer   = Buffer.from(await file.arrayBuffer());

    const { error: uploadErr } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadErr) throw uploadErr;

    // Insert DB record
    if (type === "quote") {
      const { data, error } = await supabaseAdmin
        .from("quotes")
        .insert({
          inquiry_id:   inquiryId,
          quote_number: number,
          file_path:    filePath,
          file_name:    file.name,
          total_amount: amount,
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
          const { data: customer } = await supabaseAdmin
            .from("inquiries_with_customers")
            .select("*")
            .eq("id", inquiryId)
            .single();

          if (customer?.email) {
            const { data: signedUrlData } = await supabaseAdmin.storage
              .from("quotes")
              .createSignedUrl(filePath, 60 * 60 * 24 * 30);

            if (signedUrlData?.signedUrl) {
              await sendQuoteAutomationEmail({
                customerEmail: customer.email,
                customerName: customer.full_name,
                companyName: customer.company_name,
                quoteNumber: number,
                amount,
                currency,
                validUntil: validUntil || null,
                notes: notes || null,
                signedUrl: signedUrlData.signedUrl,
                product: customer.product,
                inquiryIdText: customer.inquiry_id,
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
          file_name:      file.name,
          amount,
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
          const { data: customer } = await supabaseAdmin
            .from("inquiries_with_customers")
            .select("*")
            .eq("id", inquiryId)
            .single();

          if (customer?.email) {
            const { data: signedUrlData } = await supabaseAdmin.storage
              .from("invoices")
              .createSignedUrl(filePath, 60 * 60 * 24 * 30);

            if (signedUrlData?.signedUrl) {
              await sendInvoiceAutomationEmail({
                customerEmail: customer.email,
                customerName: customer.full_name,
                companyName: customer.company_name,
                invoiceNumber: number,
                amount,
                currency,
                dueDate: dueDate || null,
                notes: notes || null,
                signedUrl: signedUrlData.signedUrl,
                product: customer.product,
                inquiryIdText: customer.inquiry_id,
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
