"use client";

import { getSupabaseClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    document.cookie = "kltraders_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    await getSupabaseClient().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="w-full flex items-center gap-2 text-xs text-green-400 hover:text-white transition-colors disabled:opacity-60"
    >
      <LogOut className="w-3.5 h-3.5" />
      {loading ? "Signing out..." : "Logout"}
    </button>
  );
}
