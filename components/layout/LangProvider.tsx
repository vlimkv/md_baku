"use client";

import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { siteContent, type Lang } from "@/lib/data";

type T = (typeof siteContent)[Lang];

type LangContextValue = {
  lang: Lang;
  setLang: React.Dispatch<React.SetStateAction<Lang>>;
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  t: T;
};

const LangContext = createContext<LangContextValue | null>(null);

function langFromPath(pathname: string): Lang {
  const seg = pathname.split("/")[1];
  return seg === "ru" ? "ru" : "az";
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const [lang, setLang] = useState<Lang>(() => langFromPath(pathname));
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const next = langFromPath(pathname);
    setLang(next);
  }, [pathname]);

  const t = siteContent[lang];

  const value = useMemo(
    () => ({ lang, setLang, menuOpen, setMenuOpen, t }),
    [lang, menuOpen, t]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within <LangProvider>");
  return ctx;
}