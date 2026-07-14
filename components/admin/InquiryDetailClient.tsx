"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  CheckCircle2, FileUp, Download, ChevronDown,
  Save, Loader2, FileCheck, Receipt, StickyNote,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import { INQUIRY_STATUSES, STATUS_CONFIG } from "@/lib/utils";
import type { InquiryStatus, InquiryWithCustomer, Quote, Invoice } from "@/types";

interface Props {
  inquiry: InquiryWithCustomer;
  quotes: Quote[];
  invoices: Invoice[];
}

export default function InquiryDetailClient({ inquiry, quotes, invoices }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Status update
  const [selectedStatus, setSelectedStatus] = useState<InquiryStatus>(inquiry.status as InquiryStatus);
  const [adminNotes, setAdminNotes] = useState(inquiry.admin_notes || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Upload / Generator state
  const [mode, setMode] = useState<"generate" | "upload">("generate");
  const [uploadType, setUploadType] = useState<"quote" | "invoice">("quote");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadAmount, setUploadAmount] = useState("");
  const [uploadCurrency, setUploadCurrency] = useState("USD");
  const [uploadNotes, setUploadNotes] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Auto-generation form states
  const [unitPrice, setUnitPrice] = useState("");
  const [shipping, setShipping] = useState("0");
  const [validUntil, setValidUntil] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${inquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus, admin_notes: adminNotes }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      startTransition(() => router.refresh());
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async () => {
    setUploadError("");
    setUploading(true);

    try {
      const form = new FormData();
      form.append("type", uploadType);
      form.append("inquiry_id", inquiry.id);
      form.append("currency", uploadCurrency);
      if (uploadNotes) form.append("notes", uploadNotes);

      if (mode === "upload") {
        const file = fileRef.current?.files?.[0];
        if (!file) {
          setUploadError("Please select a PDF file.");
          setUploading(false);
          return;
        }
        form.append("file", file);
        if (uploadAmount) form.append("amount", uploadAmount);
      } else {
        if (!unitPrice) {
          setUploadError("Please enter a unit price.");
          setUploading(false);
          return;
        }
        form.append("generate_auto", "true");
        form.append("unit_price", unitPrice);
        form.append("shipping", shipping);
        if (uploadType === "quote") {
          if (validUntil) form.append("valid_until", validUntil);
        } else {
          if (dueDate) form.append("due_date", dueDate);
        }
      }

      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      // Reset forms
      if (fileRef.current) fileRef.current.value = "";
      setUploadAmount("");
      setUploadNotes("");
      setUnitPrice("");
      setShipping("0");
      setValidUntil("");
      setDueDate("");
      startTransition(() => router.refresh());
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : "Action failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* ── Status & Notes ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-[#114A2C] text-sm mb-5 font-[Poppins]">
          Manage Inquiry
        </h3>

        {/* Status selector */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Status
          </label>
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as InquiryStatus)}
              className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2D3748] focus:outline-none focus:ring-2 focus:ring-[#1D6F42]/30 focus:border-[#1D6F42] pr-10"
            >
              {INQUIRY_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Admin notes */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <StickyNote className="w-3.5 h-3.5" /> Internal Notes
          </label>
          <textarea
            rows={4}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Add internal notes, follow-up reminders, negotiation details..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2D3748] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D6F42]/30 focus:border-[#1D6F42] resize-none"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#1D6F42] hover:bg-[#114A2C] disabled:opacity-70 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* ── Document Generator / Manual Upload ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-[#114A2C] text-sm mb-5 font-[Poppins] flex items-center gap-2">
          <FileUp className="w-4 h-4 text-[#1D6F42]" />
          Issue Document
        </h3>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-gray-100 mb-5">
          <button
            type="button"
            onClick={() => setMode("generate")}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 text-center transition-all ${
              mode === "generate"
                ? "border-[#1D6F42] text-[#1D6F42]"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Auto-Generate PDF
          </button>
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 text-center transition-all ${
              mode === "upload"
                ? "border-[#1D6F42] text-[#1D6F42]"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Upload Manual PDF
          </button>
        </div>

        {/* Type Toggle (Quote / Invoice) */}
        <div className="flex gap-2 mb-4">
          {(["quote", "invoice"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setUploadType(t)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                uploadType === t
                  ? "bg-[#1D6F42] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t === "quote" ? <FileCheck className="w-3.5 h-3.5" /> : <Receipt className="w-3.5 h-3.5" />}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {mode === "generate" ? (
            // AUTO GENERATE FORM
            <>
              {/* Unit Price + Currency */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Unit Price (per unit / kg) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    placeholder="e.g. 2.50"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6F42]/30 focus:border-[#1D6F42]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Currency
                  </label>
                  <select
                    value={uploadCurrency}
                    onChange={(e) => setUploadCurrency(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6F42]/30"
                  >
                    {["USD", "EUR", "GBP", "AED", "SAR", "INR"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Shipping Costs */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Shipping & Freight Cost
                </label>
                <input
                  type="number"
                  value={shipping}
                  onChange={(e) => setShipping(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6F42]/30 focus:border-[#1D6F42]"
                />
              </div>

              {/* Date Limit */}
              {uploadType === "quote" ? (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Quote Valid Until (date)
                  </label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6F42]/30"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Invoice Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6F42]/30"
                  />
                </div>
              )}
            </>
          ) : (
            // MANUAL UPLOAD FORM
            <>
              {/* File Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  PDF File *
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/pdf"
                  className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#E8F5E9] file:text-[#1D6F42] hover:file:bg-[#1D6F42] hover:file:text-white file:transition-colors cursor-pointer"
                />
              </div>

              {/* Amount + Currency */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Total Amount (optional)
                  </label>
                  <input
                    type="number"
                    value={uploadAmount}
                    onChange={(e) => setUploadAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6F42]/30 focus:border-[#1D6F42]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Currency
                  </label>
                  <select
                    value={uploadCurrency}
                    onChange={(e) => setUploadCurrency(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6F42]/30"
                  >
                    {["USD", "EUR", "GBP", "AED", "SAR", "INR"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Notes (common) */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Notes / Payment Instructions (optional)
            </label>
            <input
              type="text"
              value={uploadNotes}
              onChange={(e) => setUploadNotes(e.target.value)}
              placeholder={mode === "generate" ? "e.g. Bank details, packaging instructions..." : "e.g. Valid for 30 days, includes shipping"}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6F42]/30 focus:border-[#1D6F42]"
            />
          </div>

          {uploadError && (
            <p className="text-red-500 text-xs">{uploadError}</p>
          )}

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full flex items-center justify-center gap-2 bg-[#1D6F42] hover:bg-[#114A2C] disabled:opacity-70 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] duration-150 shadow-md shadow-green-950/10 cursor-pointer"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileUp className="w-4 h-4" />
            )}
            {uploading 
              ? (mode === "generate" ? "Generating..." : "Uploading...") 
              : (mode === "generate" ? `Generate & Send ${uploadType.charAt(0).toUpperCase() + uploadType.slice(1)}` : `Upload & Send ${uploadType.charAt(0).toUpperCase() + uploadType.slice(1)}`)}
          </button>
        </div>
      </div>

      {/* ── Quotes ── */}
      {quotes.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-[#114A2C] text-sm font-[Poppins] flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-purple-500" />
              Quotes ({quotes.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {quotes.map((q) => (
              <div key={q.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div>
                  <code className="text-xs font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded">{q.quote_number}</code>
                  <div className="text-xs text-gray-400 mt-1">
                    {format(new Date(q.created_at), "dd MMM yyyy")}
                    {q.total_amount != null && ` | ${q.currency} ${q.total_amount.toLocaleString()}`}
                    {q.notes && ` | ${q.notes}`}
                  </div>
                </div>
                {q.file_path && (
                  <a
                    href={`/api/admin/download?bucket=quotes&path=${encodeURIComponent(q.file_path)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-[#1D6F42] hover:underline font-semibold"
                  >
                    <Download size={13} /> PDF
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Invoices ── */}
      {invoices.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-[#114A2C] text-sm font-[Poppins] flex items-center gap-2">
              <Receipt className="w-4 h-4 text-amber-500" />
              Invoices ({invoices.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {invoices.map((inv) => (
              <div key={inv.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div>
                  <code className="text-xs font-mono bg-amber-50 text-amber-700 px-2 py-0.5 rounded">{inv.invoice_number}</code>
                  <div className="text-xs text-gray-400 mt-1">
                    {format(new Date(inv.created_at), "dd MMM yyyy")}
                    {inv.amount != null && ` | ${inv.currency} ${inv.amount.toLocaleString()}`}
                    {inv.due_date && ` | Due: ${format(new Date(inv.due_date), "dd MMM yyyy")}`}
                  </div>
                </div>
                {inv.file_path && (
                  <a
                    href={`/api/admin/download?bucket=invoices&path=${encodeURIComponent(inv.file_path)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-[#1D6F42] hover:underline font-semibold"
                  >
                    <Download size={13} /> PDF
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
