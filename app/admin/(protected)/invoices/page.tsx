import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { format } from "date-fns";
import { Download } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import type { InvoiceWithInquiryCustomer } from "@/types";
import Link from "next/link";

export const metadata: Metadata = { title: "Invoices" };
export const revalidate = 0;

/**
 * Same cardinality normaliser as on the quotes page.
 * invoices.inquiry_id is a many-to-one FK so the runtime value is always
 * an object, but the SDK may type it as T | T[].
 */
function normaliseInquiry(
  raw: InvoiceWithInquiryCustomer["inquiries"] | InvoiceWithInquiryCustomer["inquiries"][]
): InvoiceWithInquiryCustomer["inquiries"] {
  if (Array.isArray(raw)) return raw[0] ?? null;
  return raw ?? null;
}

export default async function InvoicesPage() {
  const { data, error } = await supabaseAdmin
    .from("invoices")
    .select(
      "id, inquiry_id, quote_id, invoice_number, file_path, file_name, amount, currency, due_date, paid_at, notes, created_at, updated_at, inquiries(id, inquiry_id, status, product, customers(company_name, country))"
    )
    .order("created_at", { ascending: false });

  // Single cast at the data boundary — the select string above exactly
  // matches InvoiceWithInquiryCustomer.
  const rows = (data ?? []) as unknown as InvoiceWithInquiryCustomer[];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#114A2C] font-[Poppins]">Invoices</h1>
        <p className="text-gray-500 text-sm mt-1">{rows.length} invoices issued</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Invoice #", "Inquiry", "Company", "Amount", "Due Date", "Paid", "Status", ""].map((h) => (
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
                    No invoices yet.
                  </td>
                </tr>
              ) : (
                rows.map((inv) => {
                  // Normalise the nested relation to a plain object or null
                  const inq = normaliseInquiry(inv.inquiries);

                  return (
                    <tr key={inv.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <code className="text-xs font-mono bg-amber-50 text-amber-700 px-2 py-1 rounded font-semibold">
                          {inv.invoice_number}
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

                      <td className="px-5 py-4 text-sm font-semibold text-[#114A2C]">
                        {inv.amount != null
                          ? `${inv.currency} ${inv.amount.toLocaleString()}`
                          : "—"}
                      </td>

                      <td className="px-5 py-4 text-xs text-gray-500">
                        {inv.due_date
                          ? format(new Date(inv.due_date), "dd MMM yyyy")
                          : "—"}
                      </td>

                      <td className="px-5 py-4">
                        {inv.paid_at ? (
                          <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full">
                            Paid {format(new Date(inv.paid_at), "dd MMM")}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                            Unpaid
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {inq?.status && <StatusBadge status={inq.status} />}
                      </td>

                      <td className="px-5 py-4">
                        {inv.file_path && (
                          <a
                            href={`/api/admin/download?bucket=invoices&path=${encodeURIComponent(inv.file_path)}`}
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

