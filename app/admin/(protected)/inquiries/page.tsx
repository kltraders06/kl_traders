import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase/admin";
import InquiriesClient from "@/components/admin/InquiriesClient";
import type { InquiryStatus, InquiryWithCustomer } from "@/types";

export const metadata: Metadata = { title: "Inquiries" };
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function InquiriesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status  = (params.status  || "all") as InquiryStatus | "all";
  const search  = params.search  || "";
  const page    = Math.max(1, parseInt(params.page || "1"));
  const pageSize = 20;
  const from     = (page - 1) * pageSize;

  let query = supabaseAdmin
    .from("inquiries_with_customers")
    .select("*", { count: "exact" });

  if (status !== "all") query = query.eq("status", status);
  if (search) {
    query = query.or(
      `company_name.ilike.%${search}%,email.ilike.%${search}%,inquiry_id.ilike.%${search}%,full_name.ilike.%${search}%,country.ilike.%${search}%,product.ilike.%${search}%`
    );
  }

  const { data: rawInquiries, count } = await query
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);

  // Single cast at the data boundary — the view columns match InquiryWithCustomer exactly.
  const inquiries = (rawInquiries ?? []) as unknown as InquiryWithCustomer[];
  const total = count ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-4 sm:p-6 xl:p-8">
      <div className="mb-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-[#1D6F42]">Buyer Pipeline</p>
        <h1 className="mt-2 text-2xl font-bold text-[#114A2C] font-[Poppins]">Inquiries</h1>
        <p className="text-gray-500 text-sm mt-1">
          {total} total inquir{total !== 1 ? "ies" : "y"}
        </p>
      </div>

      <InquiriesClient
        inquiries={inquiries}
        total={total}
        page={page}
        totalPages={totalPages}
        currentStatus={status}
        currentSearch={search}
      />
    </div>
  );
}
