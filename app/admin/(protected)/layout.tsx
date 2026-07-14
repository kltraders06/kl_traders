import AdminSidebar from "@/components/admin/AdminSidebar";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cookieStore = await cookies();
  const isCustomAdmin = cookieStore.get("kltraders_admin_session")?.value === "true";

  if (!user && !isCustomAdmin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#F5F7F5] flex">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <div className="font-[Poppins] font-bold text-[#114A2C]">KL TRADERS Admin</div>
            <div className="flex gap-4 text-xs font-semibold text-[#1D6F42]">
              <Link href="/admin">Dashboard</Link>
              <Link href="/admin/inquiries">Inquiries</Link>
              <Link href="/admin/customers">Customers</Link>
            </div>
          </div>
        </div>
        <div className="w-full max-w-[1500px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
