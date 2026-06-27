import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin Dashboard | KL TRADERS", template: "%s | KL TRADERS Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
