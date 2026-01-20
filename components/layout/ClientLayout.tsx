"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useLang } from "@/components/layout/LangProvider";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { lang, setLang, menuOpen, setMenuOpen, t } = useLang();

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-900 selection:bg-amber-100 selection:text-amber-900">
      <Header
        lang={lang}
        setLang={setLang}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        t={t}
      />

      {children}

      <Footer t={t} />
    </div>
  );
}