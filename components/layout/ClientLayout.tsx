"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useLang } from "@/components/layout/LangProvider";
// Импортируем тип категории
import type { CategoryNavT } from "@/lib/actions/public"; 

export default function ClientLayout({ 
  children,
  categories // <--- 1. Получаем проп
}: { 
  children: React.ReactNode;
  categories: CategoryNavT[]; // <--- 2. Типизируем
}) {
  const { lang, setLang, menuOpen, setMenuOpen, t } = useLang();

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-900 selection:bg-amber-100 selection:text-amber-900">
      <Header
        lang={lang}
        setLang={setLang}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        t={t}
        categories={categories} // <--- 3. ВАЖНО: Передаем в Header
      />

      {children}

      <Footer t={t} lang={lang} />
    </div>
  );
}