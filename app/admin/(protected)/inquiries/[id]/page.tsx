import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import StatusBadge from "@/components/admin/StatusBadge";
import InquiryDetailClient from "@/components/admin/InquiryDetailClient";
import type { InquiryWithCustomer, Quote, Invoice, InquiryStatus } from "@/types";
import {
  MapPin, Mail, Phone, MessageCircle, Package,
  Calendar, Hash, Tag, FileText,
} from "lucide-react";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { data } = await supabaseAdmin
    .from("inquiries_with_customers")
    .select("inquiry_id, company_name")
    .eq("id", id)
    .single();
  return { title: data ? `${data.inquiry_id} — ${data.company_name}` : "Inquiry" };
}

export default async function InquiryDetailPage({ params }: PageProps) {
  const { id } = await params;

  const { data: rawInquiry, error } = await supabaseAdmin
    .from("inquiries_with_customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !rawInquiry) notFound();

  // Single cast at the data boundary — the view columns match InquiryWithCustomer exactly.
  const inquiry = rawInquiry as unknown as InquiryWithCustomer;

  const { data: rawQuotes } = await supabaseAdmin
    .from("quotes")
    .select("*")
    .eq("inquiry_id", id)
    .order("created_at", { ascending: false });

  const { data: rawInvoices } = await supabaseAdmin
    .from("invoices")
    .select("*")
    .eq("inquiry_id", id)
    .order("created_at", { ascending: false });

  const quotes  = (rawQuotes  ?? []) as unknown as Quote[];
  const invoices = (rawInvoices ?? []) as unknown as Invoice[];

  return (
    <div className="p-6 lg:p-8">
      {/* Breadcrumb + header */}
      <div className="mb-6">
        <div className="text-xs text-gray-400 mb-2">
          <a href="/admin/inquiries" className="hover:text-[#1D6F42]">Inquiries</a>
          {" / "}
          <span className="text-gray-600">{inquiry.inquiry_id}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#114A2C] font-[Poppins]">
                {inquiry.company_name}
              </h1>
              <StatusBadge status={inquiry.status as InquiryStatus} />
            </div>
            <code className="text-sm font-mono text-gray-400">{inquiry.inquiry_id}</code>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Customer + Inquiry details */}
        <div className="lg:col-span-1 space-y-5">
          {/* Customer card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-[#114A2C] text-sm mb-4 font-[Poppins]">Customer Details</h3>
            <div className="space-y-3">
              {[
                { icon: FileText, label: inquiry.full_name },
                { icon: MapPin, label: inquiry.country },
                { icon: Mail, label: inquiry.email, href: `mailto:${inquiry.email}` },
                inquiry.whatsapp && { icon: MessageCircle, label: inquiry.whatsapp, href: `https://wa.me/${inquiry.whatsapp?.replace(/\D/g, "")}` },
                { icon: Phone, label: `Preferred: ${inquiry.preferred_comm}` },
              ].filter(Boolean).map((item, i) => {
                if (!item) return null;
                const Icon = item.icon;
                const inner = (
                  <div key={i} className="flex items-start gap-2.5">
                    <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#2D3748]">{item.label}</span>
                  </div>
                );
                return "href" in item && item.href ? (
                  <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className="block hover:opacity-75">{inner}</a>
                ) : inner;
              })}
            </div>
            
            {/* Quick Actions */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Quick Actions</div>
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={`mailto:${inquiry.email}?subject=${encodeURIComponent(`Re: KL TRADERS Inquiry ${inquiry.inquiry_id}`)}&body=${encodeURIComponent(`Hi ${inquiry.full_name},\n\nThank you for contacting KL TRADERS regarding your inquiry for ${inquiry.product}.\n\nBest regards,\nKL TRADERS`)}`}
                  className="flex flex-col items-center justify-center p-2 rounded-xl border border-blue-100 bg-blue-50/50 text-blue-600 hover:bg-blue-100 hover:scale-[1.02] active:scale-[0.98] transition-all font-semibold text-xs text-center"
                >
                  <Mail className="w-4 h-4 mb-1" />
                  Email
                </a>
                {inquiry.whatsapp && (
                  <a
                    href={`https://wa.me/${inquiry.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${inquiry.full_name}, this is KL TRADERS regarding your inquiry ${inquiry.inquiry_id} for ${inquiry.product}...`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-2 rounded-xl border border-green-100 bg-green-50/50 text-green-600 hover:bg-green-100 hover:scale-[1.02] active:scale-[0.98] transition-all font-semibold text-xs text-center"
                  >
                    <MessageCircle className="w-4 h-4 mb-1" />
                    WhatsApp
                  </a>
                )}
                {inquiry.whatsapp && (
                  <a
                    href={`tel:${inquiry.whatsapp.replace(/\D/g, "")}`}
                    className="flex flex-col items-center justify-center p-2 rounded-xl border border-amber-100 bg-amber-50/50 text-amber-600 hover:bg-amber-100 hover:scale-[1.02] active:scale-[0.98] transition-all font-semibold text-xs text-center"
                  >
                    <Phone className="w-4 h-4 mb-1" />
                    Call
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Inquiry details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-[#114A2C] text-sm mb-4 font-[Poppins]">Inquiry Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-2"><Package className="w-4 h-4 text-gray-400 mt-0.5" /><div><div className="text-gray-400 text-xs">Product</div><div className="font-medium text-[#2D3748]">{inquiry.product}</div></div></div>
              <div className="flex gap-2"><Tag className="w-4 h-4 text-gray-400 mt-0.5" /><div><div className="text-gray-400 text-xs">Quantity</div><div className="font-medium text-[#2D3748]">{inquiry.quantity || "Not specified"}</div></div></div>
              <div className="flex gap-2"><Hash className="w-4 h-4 text-gray-400 mt-0.5" /><div><div className="text-gray-400 text-xs">Type</div><div className="font-medium text-[#2D3748]">{inquiry.inquiry_type}</div></div></div>
              <div className="flex gap-2"><Calendar className="w-4 h-4 text-gray-400 mt-0.5" /><div><div className="text-gray-400 text-xs">Received</div><div className="font-medium text-[#2D3748]">{format(new Date(inquiry.created_at), "dd MMM yyyy, HH:mm")}</div></div></div>
            </div>
            {inquiry.message && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-400 mb-1.5">Message</div>
                <p className="text-sm text-gray-600 leading-relaxed">{inquiry.message}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Status management + quotes + invoices */}
        <div className="lg:col-span-2">
          <InquiryDetailClient
            inquiry={inquiry}
            quotes={quotes}
            invoices={invoices}
          />
        </div>
      </div>
    </div>
  );
}
