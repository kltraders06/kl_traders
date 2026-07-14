"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, FileCheck, Receipt,
  ChevronRight, Leaf, ExternalLink, Users,
} from "lucide-react";
import LogoutButton from "@/components/admin/LogoutButton";

const NAV = [
  { href: "/admin",           icon: LayoutDashboard, label: "Dashboard"  },
  { href: "/admin/inquiries", icon: FileText,        label: "Inquiries"  },
  { href: "/admin/customers", icon: Users,           label: "Customers"  },
  { href: "/admin/quotes",    icon: FileCheck,       label: "Quotes"     },
  { href: "/admin/invoices",  icon: Receipt,         label: "Invoices"   },
];

export default function AdminSidebar() {
  const path = usePathname();

  return (
    <aside className="hidden w-72 bg-[#0A2E1A] text-white lg:flex flex-col min-h-screen sticky top-0 shadow-2xl shadow-black/20">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-11 h-11 bg-[#1D6F42] rounded-2xl flex items-center justify-center shadow-lg shadow-green-950/30">
            <Leaf className="w-5 h-5 text-white" fill="white" />
          </div>
          <div>
            <div className="font-bold text-base font-[Poppins]">KL TRADERS</div>
            <div className="text-[10px] text-green-400 tracking-widest">ADMIN PANEL</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = href === "/admin"
            ? path === "/admin"
            : path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 group ${
                active
                  ? "bg-[#1D6F42] text-white shadow-lg shadow-green-950/20"
                  : "text-green-200/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-white" : "text-green-400 group-hover:text-white"}`} />
              {label}
              {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-5 border-t border-white/10 space-y-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs font-bold uppercase tracking-widest text-green-300">Workflow</div>
          <p className="mt-2 text-xs leading-5 text-green-100/70">
            Review inquiries, upload quote PDFs, then upload invoice PDFs after confirmation.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-xs text-green-400 hover:text-white transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View Public Website
        </Link>
        <LogoutButton />
      </div>
    </aside>
  );
}
