"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Loader2, ArrowRight } from "lucide-react";

export default function AdminLogin() {
  const sb = supabaseBrowser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) {
        setErr("Неверные данные доступа");
        setLoading(false);
        return;
      }
      window.location.replace("/admin");
    } catch {
      setErr("Ошибка сети");
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white lg:bg-slate-50 font-sans text-slate-900">
      {/* Container:
        - Mobile: Full width, transparent (blends with white body), no shadow.
        - Desktop: Fixed width card, white bg, shadow, rounded corners.
      */}
      <div className="w-full max-w-[440px] bg-white relative p-6 sm:p-10 lg:p-12 lg:rounded-3xl lg:shadow-[0_15px_40px_-15px_rgba(0,0,0,0.08)] lg:border lg:border-slate-100 transition-all">
        
        {/* Mobile-only background accent (Top Line) */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 to-amber-700 lg:hidden" />

        <div className="space-y-8">
          {/* Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              MD<span className="text-amber-600">BAKU</span>
            </h2>
            <h3 className="mt-2 text-2xl font-bold text-slate-800">
              С возвращением
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Введите данные для входа в панель.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-900 block text-left">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-base font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all"
                placeholder="admin@admin.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-900 block">
                  Пароль
                </label>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-base font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Error Message */}
            {err && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-semibold animate-in slide-in-from-top-2 text-center">
                {err}
              </div>
            )}

            {/* Button */}
            <button
              disabled={loading}
              className="w-full h-12 bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white rounded-xl font-bold text-base transition-all shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>Войти</span>
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center lg:text-left">
            <p className="text-xs text-slate-400 font-medium">
                &copy; {new Date().getFullYear()} MD Baku Administration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}