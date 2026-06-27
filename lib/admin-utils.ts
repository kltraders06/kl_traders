import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Generates a human-readable unique inquiry ID.
 * Format: KLT-YYYYMMDD-NNNN
 */
export async function generateInquiryId(): Promise<string> {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const { count } = await supabaseAdmin
    .from("inquiries")
    .select("*", { count: "exact", head: true })
    .gte("created_at", startOfDay.toISOString())
    .lte("created_at", endOfDay.toISOString());

  const seq = String((count ?? 0) + 1).padStart(4, "0");
  return `KLT-${datePart}-${seq}`;
}

export async function generateQuoteNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const { count } = await supabaseAdmin
    .from("quotes")
    .select("*", { count: "exact", head: true });
  const seq = String((count ?? 0) + 1).padStart(4, "0");
  return `KLT-Q-${year}-${seq}`;
}

export async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const { count } = await supabaseAdmin
    .from("invoices")
    .select("*", { count: "exact", head: true });
  const seq = String((count ?? 0) + 1).padStart(4, "0");
  return `KLT-INV-${year}-${seq}`;
}
