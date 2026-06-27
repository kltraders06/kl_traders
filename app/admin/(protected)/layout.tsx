import AdminSidebar from "@/components/admin/AdminSidebar";
import { createSupabaseServerClient } from "@/lib/supabase/server";
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

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#F5F7F5] flex">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="w-full max-w-[1500px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
