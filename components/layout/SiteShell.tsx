"use client";

import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useLang } from "@/components/layout/LangProvider";
import type { Lang } from "@/lib/data";
// Импортируем тип категории
import type { CategoryNavT } from "@/lib/actions/public";

export default function SiteShell({
  children,
  lang,
  categories, // <--- 1. Принимаем категории
}: {
  children: React.ReactNode;
  lang: Lang;
  categories: CategoryNavT[];
}) {
  const { setLang, menuOpen, setMenuOpen, t } = useLang();

  // Синхронизация языка при смене роута
  useEffect(() => {
    setLang(lang);
  }, [lang, setLang]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-900 selection:bg-amber-100 selection:text-amber-900">
      <Header
        lang={lang}
        setLang={setLang}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        t={t}
        categories={categories} // <--- 2. Передаем в Хедер
      />

      {children}

      <Footer t={t} />
    </div>
  );
}