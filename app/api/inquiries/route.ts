import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateInquiryId } from "@/lib/admin-utils";
import { sendInquiryEmail } from "@/lib/email";
import type { ContactFormData, ApiResponse, Inquiry } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: ContactFormData = await req.json();

    // ── Validate required fields ─────────────────────────────────
    const required: (keyof ContactFormData)[] = [
      "fullName", "companyName", "country", "email",
      "product", "inquiryType",
    ];
    for (const field of required) {
      if (!body[field]?.toString().trim()) {
        return NextResponse.json<ApiResponse<never>>(
          { success: false, error: `Field "${field}" is required.` },
          { status: 400 }
        );
      }
    }

    // ── Upsert customer (match on email) ─────────────────────────
    // If this email has contacted before, update their record.
    const { data: existingCustomers } = await supabaseAdmin
      .from("customers")
      .select("id")
      .eq("email", body.email.toLowerCase().trim())
      .limit(1);

    let customerId: string;

    if (existingCustomers && existingCustomers.length > 0) {
      // Update existing customer details
      const { error: updateErr } = await supabaseAdmin
        .from("customers")
        .update({
          full_name:      body.fullName.trim(),
          company_name:   body.companyName.trim(),
          country:        body.country.trim(),
          whatsapp:       body.whatsapp?.trim() || null,
          preferred_comm: body.preferredComm,
        })
        .eq("id", existingCustomers[0].id);

      if (updateErr) throw updateErr;
      customerId = existingCustomers[0].id;
    } else {
      // Create new customer
      const { data: newCustomer, error: insertErr } = await supabaseAdmin
        .from("customers")
        .insert({
          full_name:      body.fullName.trim(),
          company_name:   body.companyName.trim(),
          country:        body.country.trim(),
          email:          body.email.toLowerCase().trim(),
          whatsapp:       body.whatsapp?.trim() || null,
          preferred_comm: body.preferredComm,
        })
        .select("id")
        .single();

      if (insertErr || !newCustomer) throw insertErr;
      customerId = newCustomer.id;
    }

    // ── Generate unique inquiry ID ────────────────────────────────
    const inquiryId = await generateInquiryId();

    // ── Insert inquiry ────────────────────────────────────────────
    const { data: inquiry, error: inquiryErr } = await supabaseAdmin
      .from("inquiries")
      .insert({
        inquiry_id:   inquiryId,
        customer_id:  customerId,
        product:      body.product.trim(),
        quantity:     body.quantity?.trim() || null,
        inquiry_type: body.inquiryType,
        message:      body.message?.trim() || null,
        status:       "new",
      })
      .select()
      .single();

    if (inquiryErr || !inquiry) throw inquiryErr;

    // Send email notification to admin (non-blocking)
    sendInquiryEmail({
      inquiryId,
      fullName: body.fullName,
      companyName: body.companyName,
      country: body.country,
      email: body.email,
      whatsapp: body.whatsapp,
      preferredComm: body.preferredComm,
      product: body.product,
      quantity: body.quantity,
      inquiryType: body.inquiryType,
      message: body.message,
    }).catch((err) => console.error("[POST /api/inquiries] Background email error:", err));

    return NextResponse.json<ApiResponse<{ inquiry_id: string }>>({
      success: true,
      data: { inquiry_id: inquiryId },
    });
  } catch (err) {
    console.error("[POST /api/inquiries]", err);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Failed to submit inquiry. Please try again." },
      { status: 500 }
    );
  }
}
