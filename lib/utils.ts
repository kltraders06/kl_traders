import type { InquiryStatus } from "@/types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Status badge styling map */
export const STATUS_CONFIG: Record<
  InquiryStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  new:          { label: "New",          color: "text-blue-700",  bg: "bg-blue-50",   dot: "bg-blue-500"   },
  in_review:    { label: "In Review",    color: "text-amber-700", bg: "bg-amber-50",  dot: "bg-amber-500"  },
  quoted:       { label: "Quoted",       color: "text-purple-700",bg: "bg-purple-50", dot: "bg-purple-500" },
  negotiating:  { label: "Negotiating",  color: "text-orange-700",bg: "bg-orange-50", dot: "bg-orange-500" },
  confirmed:    { label: "Confirmed",    color: "text-green-700", bg: "bg-green-50",  dot: "bg-green-500"  },
  closed:       { label: "Closed",       color: "text-gray-600",  bg: "bg-gray-100",  dot: "bg-gray-400"   },
  rejected:     { label: "Rejected",     color: "text-red-700",   bg: "bg-red-50",    dot: "bg-red-500"    },
};

export const INQUIRY_STATUSES: InquiryStatus[] = [
  "new", "in_review", "quoted", "negotiating", "confirmed", "closed", "rejected",
];
