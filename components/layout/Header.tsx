"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/lib/context/cart-context"; 
import {
  Menu, X, Phone, ShoppingBag, ChevronRight,
  MapPin, Home, List, CheckCircle2, Layers,
  BookOpen, FileText, Info
} from "lucide-react";

import type { Lang } from "@/lib/data";
import type { CategoryNavT } from "@/lib/actions/public";
import { SearchBar } from "@/components/layout/search-bar"; // 👈 Импорт

type HeaderT = {
  nav: readonly string[];
  topbar: { addressShort: string };
  header: {
    searchPlaceholder: string;
    favorites: string;
    cart: string;
    allCategories: string;
    phoneLabel: string;
  };
  sections: { brandsLabel: string };
};

type Props = {
  lang: Lang;
  setLang: (l: Lang) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  t: HeaderT;
  categories: CategoryNavT[];
};

export default function Header({ lang, setLang, menuOpen, setMenuOpen, t, categories }: Props) {
  const { totalItems, setCartOpen } = useCart(); 
  const [isCatOpen, setIsCatOpen] = useState(false);

  const navRoutes = useMemo(() => [
    "/", "/products", "/blog", "/about", "/contacts", "/terms"
  ], []);

  const mobileMenuIcons = useMemo(() => [
    Home, List, BookOpen, Info, Phone, FileText
  ], []);

  const router = useRouter();
  const pathname = usePathname() || "/";

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const getDropdownClass = () => {
    const count = categories.length;
    if (count > 20) return "w-[800px] grid-cols-3";
    if (count > 8) return "w-[550px] grid-cols-2";
    return "w-[280px] grid-cols-1";
  };

  const switchLang = (next: Lang) => {
    const parts = pathname.split("/");
    if (parts.length < 2 || (parts[1] !== "ru" && parts[1] !== "az")) {
      router.push(`/${next}`);
      return;
    }
    parts[1] = next;
    const nextPath = parts.join("/") || `/${next}`;
    router.push(nextPath);
    setMenuOpen(false);
    setLang(next);
  };

  return (
    <>
      {/* ТОПБАР (Десктоп) */}
      <div className="bg-gray-100 border-b border-gray-200 text-[11px] text-gray-600 py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <span className="flex items-center gap-1"><MapPin size={12} /> {t.topbar.addressShort}</span>
            <a href="tel:+994552677811" className="hover:text-amber-600 font-bold transition flex items-center gap-1"><Phone size={12} /> (+994 55) 267 78 11</a>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button type="button" onClick={() => switchLang("az")} className={`font-bold hover:text-gray-900 ${lang === "az" ? "text-gray-900" : "text-gray-400"}`}>AZ</button>
              <button type="button" onClick={() => switchLang("ru")} className={`font-bold hover:text-gray-900 ${lang === "ru" ? "text-gray-900" : "text-gray-400"}`}>RU</button>
            </div>
          </div>
        </div>
      </div>

      <header className="bg-white sticky top-0 z-50 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-5">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            
            {/* ВЕРХНЯЯ СТРОКА: ЛОГО + КНОПКИ МОБИЛЬНЫЕ */}
            <div className="flex justify-between items-center w-full md:w-auto">
              <Link href={`/${lang}`} className="flex flex-col leading-none shrink-0 group">
                <span className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter group-hover:opacity-80 transition">MD <span className="text-amber-600">BAKU</span></span>
                <span className="text-[9px] md:text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase pl-0.5">Professional Detectors</span>
              </Link>

              {/* Мобильные кнопки */}
              <div className="flex items-center gap-3 md:hidden">
                <a href="tel:+994552677811" className="text-gray-700 p-1 active:scale-95 transition">
                    <Phone size={22} />
                </a>
                <button onClick={() => setCartOpen(true)} className="text-gray-700 p-1 relative active:scale-95 transition">
                    <ShoppingBag size={22} />
                    {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-sm">
                            {totalItems}
                        </span>
                    )}
                </button>
                <button type="button" onClick={() => setMenuOpen(!menuOpen)} className="text-gray-900 p-1 active:scale-95 transition">
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
              </div>
            </div>

            {/* ПОИСК (На мобиле он теперь на второй строке, во всю ширину) */}
            <div className="w-full md:flex-1 md:max-w-xl md:mx-auto">
               <SearchBar lang={lang} placeholder={t.header.searchPlaceholder} />
            </div>

            {/* ДЕСКТОПНЫЕ ИКОНКИ (Справа) */}
            <div className="hidden md:flex items-center gap-6 ml-auto shrink-0">
              <a 
                href="tel:+994552677811" 
                className="flex flex-col items-center group text-gray-500 hover:text-amber-600 transition relative"
              >
                <div className="relative">
                  <Phone size={24} className="mb-1 group-hover:-translate-y-1 transition-transform duration-300" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] uppercase font-bold">{t.header.phoneLabel || "Связаться"}</span>
              </a>

              <button 
                onClick={() => setCartOpen(true)}
                className="flex flex-col items-center group text-gray-500 hover:text-amber-600 transition relative"
              >
                <div className="relative">
                  <ShoppingBag size={24} className="mb-1 group-hover:-translate-y-1 transition-transform duration-300" strokeWidth={1.5} />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 bg-amber-600 text-white text-[9px] flex items-center justify-center rounded-full animate-in zoom-in">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="text-[10px] uppercase font-bold">{t.header.cart}</span>
              </button>
            </div>
          </div>
        </div>

        {/* НАВИГАЦИЯ (Десктоп) */}
        <nav className="border-t border-gray-100 bg-white hidden lg:block relative">
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex items-center gap-8 text-[13px] font-bold uppercase tracking-wide text-gray-900 h-12">
              <li 
                className="flex items-center gap-2 pr-6 border-r border-gray-100 cursor-pointer hover:text-amber-600 h-full group transition-colors relative"
                onMouseEnter={() => setIsCatOpen(true)}
                onMouseLeave={() => setIsCatOpen(false)}
              >
                <div className="flex items-center gap-2 py-4">
                    <Menu size={18} className={`transition-transform duration-300 ${isCatOpen ? 'rotate-90 text-amber-600' : ''}`} />
                    <span>{t.header.allCategories}</span>
                </div>
                <div className={`absolute top-full left-0 bg-white shadow-xl border border-gray-100 rounded-b-xl overflow-hidden transition-all duration-300 transform origin-top z-50 ${isCatOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'} ${getDropdownClass()}`}>
                    <div className="max-h-[65vh] overflow-y-auto custom-scrollbar p-2 grid gap-1">
                        {categories.map((cat) => (
                            <Link key={cat.id} href={`/${lang}/products?category=${cat.slug}`} className="flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-amber-50 hover:text-amber-600 transition-colors group/item">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover/item:bg-amber-600 transition-colors" />
                                    <span className="text-xs font-bold leading-tight">{cat.title}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
              </li>

              {t.nav.map((item, i) => (
                <li key={i} className="h-full flex items-center">
                  <Link href={`/${lang}${navRoutes[i]}`} className="hover:text-amber-600 transition relative group py-4">
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-amber-600 transition-all duration-300 group-hover:w-full rounded-t-full"></span>
                  </Link>
                </li>
              ))}
              
              <li className="ml-auto flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                <CheckCircle2 size={14} fill="currentColor" className="text-amber-600" />
                <span className="text-[10px] font-extrabold tracking-wider">{t.sections.brandsLabel}</span>
              </li>
            </ul>
          </div>
        </nav>

        {/* МОБИЛЬНОЕ МЕНЮ (Drawer) */}
        {menuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-white flex flex-col animate-fade-in-down h-[100dvh]">
            <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-100 shrink-0">
                <div className="flex bg-white rounded-md border border-gray-200 p-1">
                    <button type="button" onClick={() => switchLang("az")} className={`px-4 py-1.5 rounded text-xs font-bold transition ${lang === "az" ? "bg-amber-600 text-white" : "text-gray-600"}`}>AZ</button>
                    <button type="button" onClick={() => switchLang("ru")} className={`px-4 py-1.5 rounded text-xs font-bold transition ${lang === "ru" ? "bg-amber-600 text-white" : "text-gray-600"}`}>RU</button>
                </div>
                <button onClick={() => setMenuOpen(false)} className="text-gray-500">
                    <X size={28} />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
                <div className="mb-2">
                    <div className="px-5 py-3 text-[10px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-2 bg-gray-50/50">
                        <Layers size={14} /> {t.header.allCategories}
                    </div>
                    <div className="border-b border-gray-100">
                        {categories.map((cat) => (
                            <Link key={cat.id} href={`/${lang}/products?category=${cat.slug}`} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:text-amber-600 active:bg-gray-50 border-b border-gray-50 last:border-0">
                                <div className="w-1 h-1 rounded-full bg-gray-300"></div>{cat.title}
                            </Link>
                        ))}
                    </div>
                </div>
                {t.nav.map((item, i) => {
                    const Icon = mobileMenuIcons[i] || ChevronRight;
                    return (
                        <Link key={i} href={`/${lang}${navRoutes[i]}`} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-5 py-4 font-bold text-gray-800 hover:text-amber-600 hover:bg-amber-50 border-b border-gray-50 last:border-0 text-sm transition">
                            <Icon size={20} className="text-gray-400" />{item}<ChevronRight size={16} className="ml-auto text-gray-300" />
                        </Link>
                    );
                })}
            </div>
          </div>
        )}
      </header>
    </>
  );
}