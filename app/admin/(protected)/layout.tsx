import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/admin/header"; // Не забудьте этот импорт
import Link from "next/link";
import { 
  ShieldAlert, 
  LockKeyhole, 
  UserX, 
  ChevronLeft, 
  Terminal, 
  LogOut
} from "lucide-react";

// Отключаем кеширование для админки
export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const sb = await supabaseServer();
  
  // 1. Базовая проверка авторизации
  const { data: userRes } = await sb.auth.getUser();
  if (!userRes.user) {
    redirect("/admin/login");
  }

  // 2. Получаем профиль и роль
  const { data: profile, error: profErr } = await sb
    .from("profiles")
    .select("role")
    .eq("id", userRes.user.id)
    .single();

  // ==========================================
  // СЦЕНАРИЙ 1: ОШИБКА ПРОФИЛЯ (Техническая)
  // ==========================================
  if (profErr || !profile) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 p-6 text-zinc-900">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-zinc-200 overflow-hidden relative">
          <div className="h-1.5 w-full bg-amber-500"></div>
          <div className="p-8">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 text-amber-600 border border-amber-100 shadow-sm mx-auto">
               <UserX size={28} />
            </div>
            <h2 className="text-2xl font-black text-zinc-900 mb-2 text-center">Профиль не найден</h2>
            <p className="text-zinc-500 text-center mb-6">Нет записи в таблице profiles.</p>
            
            <div className="bg-zinc-900 rounded-xl p-4 mb-6 overflow-x-auto">
               <pre className="font-mono text-[10px] text-zinc-300">
                 Error: {profErr?.message || "Profile is null"}
               </pre>
            </div>

            <form action="/auth/signout" method="post">
                <button className="w-full py-3 bg-zinc-100 hover:bg-zinc-200 rounded-xl font-bold text-sm">
                    Выйти
                </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // СЦЕНАРИЙ 2: ДОСТУП ЗАПРЕЩЕН (Security)
  // ==========================================
  if (profile.role !== "admin" && profile.role !== "editor") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-zinc-200 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -z-10"></div>
          
          <div className="relative w-20 h-20 mx-auto mb-6 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
             <ShieldAlert size={32} />
          </div>

          <h2 className="text-2xl font-black text-zinc-900 mb-2">Доступ запрещен</h2>
          <p className="text-zinc-500 text-sm mb-8">
             У роли <span className="font-mono font-bold text-zinc-900">{profile.role}</span> нет прав доступа.
          </p>

          <Link href="/" className="flex items-center justify-center w-full py-3 bg-zinc-900 text-white rounded-xl font-bold text-sm mb-3">
             <ChevronLeft size={16} className="mr-2" /> На главную
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // СЦЕНАРИЙ 3: УСПЕХ (Рендер админки + Хедер + Футер)
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Хедер теперь здесь */}
      <AdminHeader />
      
      <main>
        {children}
      </main>

      <footer className="max-w-5xl mx-auto px-6 pb-10 pt-2 text-center sm:text-left opacity-40">
         <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
           MD Baku • Административная панель
         </p>
      </footer>
    </div>
  );
}