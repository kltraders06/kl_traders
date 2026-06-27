// ─────────────────────────────────────────────
//  Shared types for KL TRADERS
// ─────────────────────────────────────────────

// ── Contact form (public-facing) ─────────────
export interface ContactFormData {
  fullName: string;
  companyName: string;
  country: string;
  email: string;
  whatsapp: string;
  product: string;
  quantity: string;
  inquiryType: InquiryType;
  preferredComm: PreferredComm;
  message: string;
}

// ── String literal union types ────────────────
export type InquiryType =
  | "Import Products"
  | "Export Products"
  | "Distribution Partnership"
  | "Bulk Purchase"
  | "General Inquiry";

export type PreferredComm = "Email" | "WhatsApp" | "Both";

export type InquiryStatus =
  | "new"
  | "in_review"
  | "quoted"
  | "negotiating"
  | "confirmed"
  | "closed"
  | "rejected";

// ── Base database row types ───────────────────
// These mirror the exact columns in each Supabase table.

export interface Customer {
  id: string;
  full_name: string;
  company_name: string;
  country: string;
  email: string;
  whatsapp: string | null;
  preferred_comm: PreferredComm;
  created_at: string;
  updated_at: string;
}

export interface Inquiry {
  id: string;
  inquiry_id: string;       // Human-readable, e.g. KLT-20240101-0001
  customer_id: string;
  product: string;
  quantity: string | null;
  inquiry_type: InquiryType;
  message: string | null;
  status: InquiryStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Quote {
  id: string;
  inquiry_id: string;
  quote_number: string;     // e.g. KLT-Q-2024-0001
  file_path: string | null; // Supabase Storage object path
  file_name: string | null;
  total_amount: number | null;
  currency: string;
  valid_until: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  inquiry_id: string;
  quote_id: string | null;
  invoice_number: string;   // e.g. KLT-INV-2024-0001
  file_path: string | null; // Supabase Storage object path
  file_name: string | null;
  amount: number | null;
  currency: string;
  due_date: string | null;
  paid_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ── Join / view shapes ────────────────────────
// Used when Supabase returns nested relations.
// Supabase returns a single related row as an object and a one-to-many
// relation as an array. The shapes below reflect what the queries in
// this codebase actually request.

/**
 * Result of the `inquiries_with_customers` view, which is a flat JOIN
 * of inquiries + customers (all columns merged into one row).
 */
export interface InquiryWithCustomer extends Inquiry {
  // Customer columns flattened into the view row
  full_name: string;
  company_name: string;
  country: string;
  email: string;
  whatsapp: string | null;
  preferred_comm: PreferredComm;
}

/**
 * Shape returned by:
 *   quotes
 *     .select("..., inquiries(id, inquiry_id, status, product,
 *                              customers(company_name, country))")
 *
 * Supabase returns the foreign-key relation `inquiries` as a single
 * object (not an array) because quotes.inquiry_id → inquiries.id is
 * many-to-one.
 */
export interface QuoteWithInquiryCustomer extends Quote {
  inquiries: {
    id: string;
    inquiry_id: string;
    status: InquiryStatus;
    product: string;
    // Nested many-to-one: inquiries.customer_id → customers.id
    customers: {
      company_name: string;
      country: string;
    } | null;
  } | null;
}

/**
 * Shape returned by:
 *   invoices
 *     .select("*, inquiries(id, inquiry_id, status, product,
 *                            customers(company_name, country))")
 *
 * Same pattern: invoices.inquiry_id → inquiries is many-to-one → object.
 */
export interface InvoiceWithInquiryCustomer extends Invoice {
  inquiries: {
    id: string;
    inquiry_id: string;
    status: InquiryStatus;
    product: string;
    customers: {
      company_name: string;
      country: string;
    } | null;
  } | null;
}

// ── API response wrappers ─────────────────────
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ── Admin dashboard helpers ───────────────────
export interface InquiryFilters {
  status?: InquiryStatus | "all";
  search?: string;
  product?: string;
  country?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
