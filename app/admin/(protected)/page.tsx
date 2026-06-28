import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { STATUS_CONFIG, INQUIRY_STATUSES } from "@/lib/utils";
import { FileText, Users, FileCheck, Receipt, TrendingUp, Inbox } from "lucide-react";
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

  const statusCounts: Record<string, number> = {};
  for (const row of byStatus ?? []) {
    statusCounts[row.status] = (statusCounts[row.status] ?? 0) + 1;
  }

  return {
    totalInquiries: totalInquiries ?? 0,
    totalCustomers: totalCustomers ?? 0,
    totalQuotes: totalQuotes ?? 0,
    totalInvoices: totalInvoices ?? 0,
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
    { label: "Total Inquiries", value: totalInquiries, icon: FileText, color: "bg-blue-500", hint: "Buyer requests" },
    { label: "Customers", value: totalCustomers, icon: Users, color: "bg-purple-500", hint: "Companies captured" },
    { label: "Quotes Issued", value: totalQuotes, icon: FileCheck, color: "bg-[#1D6F42]", hint: "Uploaded PDFs" },
    { label: "Invoices", value: totalInvoices, icon: Receipt, color: "bg-amber-500", hint: "Uploaded PDFs" },
  ];

  return (
    <div className="p-4 sm:p-6 xl:p-8">
      <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-[#0A2E1A] to-[#1D6F42] p-6 text-white shadow-xl shadow-green-950/10 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-green-200">Admin Workspace</p>
          <h1 className="mt-2 text-2xl font-bold font-[Poppins] sm:text-3xl">Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-green-100/85">
            Overview of inquiries, customers, quotes, and invoice uploads.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="inline-flex w-fit rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#1D6F42] hover:bg-green-50"
        >
          View Website
        </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div className={`w-12 h-12 ${c.color} rounded-2xl flex items-center justify-center mb-4 shadow-sm`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[11px] text-gray-400 font-medium">{c.hint}</span>
              </div>
              <div className="text-4xl font-bold text-[#114A2C] font-[Poppins]">{c.value}</div>
              <div className="text-sm text-gray-500 mt-0.5">{c.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-[#114A2C] font-[Poppins]">Recent Inquiries</h2>
            <Link href="/admin/inquiries" className="text-sm text-[#1D6F42] hover:underline font-medium">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentInquiries.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Inbox className="w-9 h-9 text-gray-300 mx-auto mb-3" />
                <div className="font-semibold text-[#114A2C]">No inquiries yet.</div>
                <p className="text-gray-400 text-sm mt-1">Submit an inquiry from the public website.</p>
              </div>
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
                    <div className="text-xs text-gray-400 truncate">{inq.inquiry_id} | {inq.country} | {inq.product}</div>
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
