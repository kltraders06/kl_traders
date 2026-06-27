import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { ApiResponse, PaginatedResult, InquiryStatus } from "@/types";

// Admin-only: returns paginated, filtered inquiries with customer data
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status    = searchParams.get("status") as InquiryStatus | "all" | null;
    const search    = searchParams.get("search") || "";
    const country   = searchParams.get("country") || "";
    const product   = searchParams.get("product") || "";
    const page      = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const pageSize  = Math.min(50, parseInt(searchParams.get("pageSize") || "20"));
    const from      = (page - 1) * pageSize;

    // Build query against the view that joins customers
    let query = supabaseAdmin
      .from("inquiries_with_customers")
      .select("*", { count: "exact" });

    // Status filter
    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    // Country filter
    if (country) {
      query = query.ilike("country", `%${country}%`);
    }

    // Product filter
    if (product) {
      query = query.ilike("product", `%${product}%`);
    }

    // Full-text search across company, email, inquiry_id
    if (search) {
      query = query.or(
        `company_name.ilike.%${search}%,email.ilike.%${search}%,inquiry_id.ilike.%${search}%,full_name.ilike.%${search}%`
      );
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, from + pageSize - 1);

    if (error) throw error;

    const total = count ?? 0;
    const result: PaginatedResult<typeof data[0]> = {
      data: data ?? [],
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };

    return NextResponse.json<ApiResponse<typeof result>>({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("[GET /api/admin/inquiries]", err);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Failed to fetch inquiries." },
      { status: 500 }
    );
  }
}
