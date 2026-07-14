"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { format } from "date-fns";
import { Search, ChevronLeft, ChevronRight, ArrowUpRight, Inbox, Download } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { INQUIRY_STATUSES, STATUS_CONFIG } from "@/lib/utils";
import type { InquiryStatus, InquiryWithCustomer } from "@/types";
import Link from "next/link";

interface Props {
  inquiries: InquiryWithCustomer[];
  total: number;
  page: number;
  totalPages: number;
  currentStatus: InquiryStatus | "all";
  currentSearch: string;
}

export default function InquiriesClient({
  inquiries, total, page, totalPages, currentStatus, currentSearch,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const downloadCSV = () => {
    if (inquiries.length === 0) return;
    const headers = [
      "Inquiry ID",
      "Company Name",
      "Contact Person",
      "Email",
      "WhatsApp",
      "Preferred Comm",
      "Country",
      "Product",
      "Quantity",
      "Inquiry Type",
      "Status",
      "Date Created"
    ];
    const rows = inquiries.map(inq => [
      inq.inquiry_id,
      inq.company_name,
      inq.full_name,
      inq.email,
      inq.whatsapp || "",
      inq.preferred_comm,
      inq.country,
      inq.product,
      inq.quantity || "",
      inq.inquiry_type,
      inq.status,
      format(new Date(inq.created_at), "yyyy-MM-dd HH:mm:ss")
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `kltraders_inquiries_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value); else params.delete(key);
      if (key !== "page") params.delete("page");
      startTransition(() => router.push(`${pathname}?${params.toString()}`));
    },
    [router, pathname, searchParams]
  );

  return (
    <div className={`transition-opacity duration-200 ${isPending ? "opacity-60" : ""}`}>
      {/* Search + Filter bar */}
      <div className="mb-5 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            defaultValue={currentSearch}
            placeholder="Search company, country, product, ID..."
            onChange={(e) => updateParam("search", e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6F42]/30 focus:border-[#1D6F42]"
          />
        </div>

        {/* Status filter pills & CSV Export */}
        <div className="flex gap-2 flex-wrap items-center justify-between w-full xl:w-auto flex-1">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => updateParam("status", "")}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                currentStatus === "all"
                  ? "bg-[#1D6F42] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-[#1D6F42]"
              }`}
            >
              All ({total})
            </button>
            {INQUIRY_STATUSES.slice(0, 4).map((s) => {
              const cfg = STATUS_CONFIG[s];
              return (
                <button
                  key={s}
                  onClick={() => updateParam("status", s)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    currentStatus === s
                      ? `${cfg.bg} ${cfg.color} border border-current/20`
                      : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>
          <button
            onClick={downloadCSV}
            disabled={inquiries.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-[#1D6F42]/10 text-[#1D6F42] hover:bg-[#1D6F42] hover:text-white transition-colors disabled:opacity-40"
          >
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Inquiry ID", "Company / Contact", "Country", "Product", "Type", "Status", "Date", ""].map(
                  (h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-gray-400 text-sm">
                    <Inbox className="w-9 h-9 text-gray-300 mx-auto mb-3" />
                    <div className="font-semibold text-[#114A2C]">No inquiries found.</div>
                    <p className="text-gray-400 mt-1">Submit an inquiry from the public website.</p>
                  </td>
                </tr>
              ) : (
                inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-[#1D6F42] font-semibold">
                        {inq.inquiry_id}
                      </code>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-[#2D3748] text-sm">{inq.company_name}</div>
                      <div className="text-xs text-gray-400">{inq.full_name} | {inq.email}</div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-sm whitespace-nowrap">{inq.country}</td>
                    <td className="px-5 py-4 text-gray-600 text-sm">{inq.product}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                        {inq.inquiry_type}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={inq.status as InquiryStatus} />
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                      {format(new Date(inq.created_at), "dd MMM yyyy")}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/inquiries/${inq.id}`}
                        className="inline-flex items-center gap-1 text-[#1D6F42] hover:underline text-xs font-semibold"
                      >
                        View <ArrowUpRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => updateParam("page", String(page - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => updateParam("page", String(page + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
