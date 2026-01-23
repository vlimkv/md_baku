"use client";

import { useState } from "react";
import Link from "next/link";
// import { useRouter } from "next/navigation"; // Больше не нужен для выхода
import { LogOut, ExternalLink, Loader2 } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth"; // <--- Импортируем Action

export function AdminHeader() {
  // const router = useRouter(); 
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      // Вызываем серверный action. Он сам сделает redirect.
      await logoutAction();
    } catch (error) {
      console.error("Ошибка выхода:", error);
      setLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/60 h-16">
      <div className="max-w-5xl w-full mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Логотип */}
        <Link href="/admin" className="flex items-center gap-2 group select-none">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            MD<span className="text-amber-600">BAKU</span>
          </h1>
          <span className="hidden sm:inline-block text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-wider ml-2 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
            Статус: Админ
          </span>
        </Link>

        {/* Правая часть */}
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            target="_blank"
            className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-amber-600 transition-colors"
          >
            <span>На сайт</span>
            <ExternalLink size={14} />
          </Link>
          
          <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

          <button 
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-red-600 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <LogOut size={16} />
            )}
            <span className="hidden sm:inline">{loading ? "Выход..." : "Выйти"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}