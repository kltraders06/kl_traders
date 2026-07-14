"use client";

import { getSupabaseClient } from "@/lib/supabase/client";
import { Leaf, Loader2, Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const inputLower = email.toLowerCase().trim();
    if (inputLower === "kltraders") {
      if (password === "arulmani06") {
        document.cookie = "kltraders_admin_session=true; path=/; max-age=86400; SameSite=Lax";
        setLoading(false);
        const next = searchParams.get("next");
        router.replace(next?.startsWith("/admin") ? next : "/admin");
        router.refresh();
        return;
      } else {
        setLoading(false);
        setError("Invalid login credentials.");
        return;
      }
    }

    const { error: loginError } = await getSupabaseClient().auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (loginError) {
      setError(loginError.message);
      return;
    }

    const next = searchParams.get("next");
    router.replace(next?.startsWith("/admin") ? next : "/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#1D6F42] rounded-xl flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" fill="white" />
          </div>
          <div>
            <h1 className="font-bold text-[#114A2C] font-[Poppins]">KL TRADERS</h1>
            <p className="text-xs text-gray-500 tracking-widest">ADMIN LOGIN</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#2D3748] mb-1.5">
              Username or Email
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#1D6F42] focus:ring-2 focus:ring-[#1D6F42]/10"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#2D3748] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 pl-4 pr-10 py-3 text-sm outline-none focus:border-[#1D6F42] focus:ring-2 focus:ring-[#1D6F42]/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#1D6F42] text-white text-sm font-semibold px-4 py-3 hover:bg-[#165734] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
