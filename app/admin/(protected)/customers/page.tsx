import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { format } from "date-fns";
import { Users, Search, Mail, MessageCircle, Phone, ArrowUpRight, Inbox } from "lucide-react";
import Link from "next/link";
import CustomersClient from "@/components/admin/CustomersClient";

export const metadata: Metadata = { title: "Customers" };
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function CustomersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search  = params.search  || "";
  const page    = Math.max(1, parseInt(params.page || "1"));
  const pageSize = 20;
  const from     = (page - 1) * pageSize;

  let query = supabaseAdmin
    .from("customers")
    .select("*, inquiries(id)", { count: "exact" });

  if (search) {
    query = query.or(
      `company_name.ilike.%${search}%,email.ilike.%${search}%,full_name.ilike.%${search}%,country.ilike.%${search}%,whatsapp.ilike.%${search}%`
    );
  }

  const { data: rawCustomers, count } = await query
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);

  const total = count ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  // Map to add inquiry count
  const customers = (rawCustomers ?? []).map((c: any) => ({
    ...c,
    inquiryCount: Array.isArray(c.inquiries) ? c.inquiries.length : 0,
  }));

  return (
    <div className="p-4 sm:p-6 xl:p-8">
      <div className="mb-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1D6F42]/10 rounded-xl flex items-center justify-center text-[#1D6F42]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#1D6F42]">Customer Database</p>
            <h1 className="mt-1 text-2xl font-bold text-[#114A2C] font-[Poppins]">Customers</h1>
          </div>
        </div>
        <p className="text-gray-500 text-sm mt-2">
          {total} registered customer{total !== 1 ? "s" : ""} in the directory.
        </p>
      </div>

      <CustomersClient
        customers={customers}
        total={total}
        page={page}
        totalPages={totalPages}
        currentSearch={search}
      />
    </div>
  );
}
