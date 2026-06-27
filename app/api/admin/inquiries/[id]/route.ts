import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { ApiResponse, InquiryStatus } from "@/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single inquiry with quotes and invoices
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { data: inquiry, error } = await supabaseAdmin
      .from("inquiries_with_customers")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !inquiry) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Inquiry not found." },
        { status: 404 }
      );
    }

    // Fetch linked quotes
    const { data: quotes } = await supabaseAdmin
      .from("quotes")
      .select("*")
      .eq("inquiry_id", id)
      .order("created_at", { ascending: false });

    // Fetch linked invoices
    const { data: invoices } = await supabaseAdmin
      .from("invoices")
      .select("*")
      .eq("inquiry_id", id)
      .order("created_at", { ascending: false });

    return NextResponse.json<ApiResponse<object>>({
      success: true,
      data: { inquiry, quotes: quotes ?? [], invoices: invoices ?? [] },
    });
  } catch (err) {
    console.error("[GET /api/admin/inquiries/:id]", err);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Server error." },
      { status: 500 }
    );
  }
}

// PATCH — update status and/or admin notes
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body: { status?: InquiryStatus; admin_notes?: string } = await req.json();

    const updatePayload: Record<string, unknown> = {};
    if (body.status)       updatePayload.status       = body.status;
    if (body.admin_notes !== undefined) updatePayload.admin_notes = body.admin_notes;

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Nothing to update." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("inquiries")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json<ApiResponse<typeof data>>({
      success: true,
      data,
    });
  } catch (err) {
    console.error("[PATCH /api/admin/inquiries/:id]", err);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Failed to update inquiry." },
      { status: 500 }
    );
  }
}
