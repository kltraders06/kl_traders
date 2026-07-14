"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { format } from "date-fns";
import { Search, ChevronLeft, ChevronRight, Mail, MessageCircle, Phone, Inbox, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Customer {
  id: string;
  full_name: string;
  company_name: string;
  country: string;
  email: string;
  whatsapp: string | null;
  preferred_comm: string;
  created_at: string;
  inquiryCount: number;
}

interface Props {
  customers: Customer[];
  total: number;
  page: number;
  totalPages: number;
  currentSearch: string;
}

export default function CustomersClient({
  customers,
  total,
  page,
  totalPages,
  currentSearch,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

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
      {/* Search bar */}
      <div className="mb-5 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            defaultValue={currentSearch}
            placeholder="Search name, company, email, phone, country..."
            onChange={(e) => updateParam("search", e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6F42]/30 focus:border-[#1D6F42]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Company / Contact", "Country", "Contact Channels", "Inquiries", "Date Added", "Quick Actions"].map(
                  (h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400 text-sm">
                    <Inbox className="w-9 h-9 text-gray-300 mx-auto mb-3" />
                    <div className="font-semibold text-[#114A2C]">No customers found.</div>
                    <p className="text-gray-400 mt-1">Customers appear here when they submit inquiries.</p>
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-[#2D3748] text-sm">{c.company_name}</div>
                      <div className="text-xs text-gray-400">{c.full_name}</div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-sm whitespace-nowrap">{c.country}</td>
                    <td className="px-5 py-4">
                      <div className="text-xs text-gray-600 font-medium">{c.email}</div>
                      {c.whatsapp && (
                        <div className="text-xs text-gray-400 mt-0.5">WA: {c.whatsapp}</div>
                      )}
                      <div className="text-[10px] bg-green-50 text-[#1D6F42] border border-green-100 rounded px-1.5 py-0.5 w-fit mt-1 font-semibold">
                        Prefers: {c.preferred_comm}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Link 
                        href={`/admin/inquiries?search=${encodeURIComponent(c.company_name)}`}
                        className="inline-flex items-center gap-1 text-xs bg-gray-100 hover:bg-[#E8F5E9] hover:text-[#1D6F42] transition-colors px-2.5 py-1 rounded-full font-semibold"
                      >
                        {c.inquiryCount} {c.inquiryCount === 1 ? "Inquiry" : "Inquiries"}
                        <ArrowRight size={10} />
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                      {format(new Date(c.created_at), "dd MMM yyyy")}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {/* Direct Email */}
                        <a
                          href={`mailto:${c.email}?subject=${encodeURIComponent("Regarding your inquiry - KL TRADERS")}`}
                          title="Send Email"
                          className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
                        >
                          <Mail size={14} />
                        </a>
                        {/* Direct WhatsApp */}
                        {c.whatsapp && (
                          <a
                            href={`https://wa.me/${c.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hello from KL TRADERS! Regarding your inquiry...")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Chat on WhatsApp"
                            className="w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition-colors"
                          >
                            <MessageCircle size={14} fill="currentColor" className="text-green-600" />
                          </a>
                        )}
                      </div>
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
