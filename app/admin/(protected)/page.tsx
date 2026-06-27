import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { STATUS_CONFIG, INQUIRY_STATUSES } from "@/lib/utils";
import { FileText, Users, FileCheck, Receipt, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import StatusBadge from "@/components/admin/StatusBadge";
import type { InquiryWithCustomer } from "@/types";
import Link from "next/link";

export const metadata: Metadata = { title: "Dashboard" };
export const revalidate = 0;

async function getDashboardData() {
  const [
    { count: totalInquiries },
    { count: totalCustomers },
    { count: totalQuotes },
    { count: totalInvoices },
    { data: recentInquiries },
    { data: byStatus },
  ] = await Promise.all([
    supabaseAdmin.from("inquiries").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("customers").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("quotes").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("invoices").select("*", { count: "exact", head: true }),
    supabaseAdmin
      .from("inquiries_with_customers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8),
    supabaseAdmin.from("inquiries").select("status"),
  ]);

  // Count by status
  const statusCounts: Record<string, number> = {};
  for (const row of byStatus ?? []) {
    statusCounts[row.status] = (statusCounts[row.status] ?? 0) + 1;
  }

  return {
    totalInquiries: totalInquiries ?? 0,
    totalCustomers: totalCustomers ?? 0,
    totalQuotes: totalQuotes ?? 0,
    totalInvoices: totalInvoices ?? 0,
    // Single cast at the boundary — the view columns match InquiryWithCustomer.
    recentInquiries: (recentInquiries ?? []) as unknown as InquiryWithCustomer[],
    statusCounts,
  };
}

export default async function AdminDashboard() {
  const {
    totalInquiries,
    totalCustomers,
    totalQuotes,
    totalInvoices,
    recentInquiries,
    statusCounts,
  } = await getDashboardData();

  const statCards = [
    { label: "Total Inquiries", value: totalInquiries, icon: FileText, color: "bg-blue-500"   },
    { label: "Customers",       value: totalCustomers, icon: Users,     color: "bg-purple-500" },
    { label: "Quotes Issued",   value: totalQuotes,    icon: FileCheck, color: "bg-[#1D6F42]"  },
    { label: "Invoices",        value: totalInvoices,  icon: Receipt,   color: "bg-amber-500"  },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#114A2C] font-[Poppins]">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Overview of all inquiries, customers, and documents.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 ${c.color} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-3xl font-bold text-[#114A2C] font-[Poppins]">{c.value}</div>
              <div className="text-sm text-gray-500 mt-0.5">{c.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent inquiries */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-[#114A2C] font-[Poppins]">Recent Inquiries</h2>
            <Link href="/admin/inquiries" className="text-sm text-[#1D6F42] hover:underline font-medium">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentInquiries.length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-400 text-sm">No inquiries yet.</div>
            ) : (
              recentInquiries.map((inq: InquiryWithCustomer) => (
                <Link
                  key={inq.id}
                  href={`/admin/inquiries/${inq.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#1D6F42] font-bold text-sm font-[Poppins] flex-shrink-0">
                    {inq.full_name?.charAt(0) ?? "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-[#2D3748] truncate">{inq.company_name}</div>
                    <div className="text-xs text-gray-400 truncate">{inq.inquiry_id} · {inq.country} · {inq.product}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <StatusBadge status={inq.status} />
                    <span className="text-[10px] text-gray-400">
                      {format(new Date(inq.created_at), "dd MMM yyyy")}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Status breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-[#114A2C] font-[Poppins] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#1D6F42]" />
              Status Breakdown
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {INQUIRY_STATUSES.map((s) => {
              const count = statusCounts[s] ?? 0;
              const pct = totalInquiries > 0 ? Math.round((count / totalInquiries) * 100) : 0;
              const cfg = STATUS_CONFIG[s];
              return (
                <div key={s}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                    <span className="text-xs text-gray-500">{count} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cfg.dot} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
