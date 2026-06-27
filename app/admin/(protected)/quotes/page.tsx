import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { format } from "date-fns";
import { Download } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import type { QuoteWithInquiryCustomer } from "@/types";
import Link from "next/link";

export const metadata: Metadata = { title: "Quotes" };
export const revalidate = 0;

/**
 * Supabase returns the nested `inquiries` relation as either an object or
 * an array depending on the cardinality it infers. Because quotes.inquiry_id
 * is a many-to-one FK the runtime value will always be an object (or null),
 * but the SDK types it as `T | T[]`. This helper normalises it to `T | null`
 * so the rest of the code can rely on a single shape.
 */
function normaliseInquiry(
  raw: QuoteWithInquiryCustomer["inquiries"] | QuoteWithInquiryCustomer["inquiries"][]
): QuoteWithInquiryCustomer["inquiries"] {
  if (Array.isArray(raw)) return raw[0] ?? null;
  return raw ?? null;
}

export default async function QuotesPage() {
  const { data, error } = await supabaseAdmin
    .from("quotes")
    .select(
      "id, inquiry_id, quote_number, file_path, total_amount, currency, created_at, notes, updated_at, file_name, valid_until, inquiries(id, inquiry_id, status, product, customers(company_name, country))"
    )
    .order("created_at", { ascending: false });

  // Cast once at the boundary — the select string above exactly matches
  // QuoteWithInquiryCustomer, so this is safe and narrows fully.
  const rows = (data ?? []) as unknown as QuoteWithInquiryCustomer[];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#114A2C] font-[Poppins]">Quotes</h1>
        <p className="text-gray-500 text-sm mt-1">{rows.length} quotes issued</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Quote #", "Inquiry", "Company", "Product", "Amount", "Status", "Date", ""].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-gray-400 text-sm">
                    No quotes yet.
                  </td>
                </tr>
              ) : (
                rows.map((q) => {
                  // Normalise the nested relation to a plain object or null
                  const inq = normaliseInquiry(q.inquiries);

                  return (
                    <tr key={q.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <code className="text-xs font-mono bg-purple-50 text-purple-700 px-2 py-1 rounded font-semibold">
                          {q.quote_number}
                        </code>
                      </td>

                      <td className="px-5 py-4">
                        {inq && (
                          <Link
                            href={`/admin/inquiries/${inq.id}`}
                            className="text-xs text-[#1D6F42] hover:underline font-mono"
                          >
                            {inq.inquiry_id}
                          </Link>
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-[#2D3748]">
                        {inq?.customers?.company_name ?? "—"}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {inq?.product ?? "—"}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-[#114A2C]">
                        {q.total_amount != null
                          ? `${q.currency} ${q.total_amount.toLocaleString()}`
                          : "—"}
                      </td>

                      <td className="px-5 py-4">
                        {inq?.status && <StatusBadge status={inq.status} />}
                      </td>

                      <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                        {format(new Date(q.created_at), "dd MMM yyyy")}
                      </td>

                      <td className="px-5 py-4">
                        {q.file_path && (
                          <a
                            href={`/api/admin/download?bucket=quotes&path=${encodeURIComponent(q.file_path)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#1D6F42] hover:underline text-xs font-semibold"
                          >
                            <Download size={13} /> PDF
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

