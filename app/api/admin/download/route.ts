import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { ApiResponse } from "@/types";

// GET /api/admin/download?bucket=quotes&path=<storage-path>
// Returns a short-lived signed URL (60 seconds) for secure PDF download
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bucket = searchParams.get("bucket");
    const path   = searchParams.get("path");

    if (!bucket || !path) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "bucket and path are required." },
        { status: 400 }
      );
    }

    if (!["quotes", "invoices"].includes(bucket)) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Invalid bucket." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(path, 60); // 60 seconds — download must start within this window

    if (error || !data?.signedUrl) {
      throw error ?? new Error("Failed to generate signed URL.");
    }

    // Redirect to signed URL so the browser downloads it directly
    return NextResponse.redirect(data.signedUrl);
  } catch (err) {
    console.error("[GET /api/admin/download]", err);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Could not generate download link." },
      { status: 500 }
    );
  }
}
