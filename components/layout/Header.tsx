"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Phone,
  ShoppingBag,
  User,
  Search,
  Heart,
  ChevronRight,
  MapPin,
  Home,
  List,
  Tag,
  Percent,
  Monitor,
  CheckCircle2,
  Layers,
} from "lucide-react";

import type { Lang } from "@/lib/data";
import type { CategoryNavT } from "@/lib/actions/public";

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
  const [isCatOpen, setIsCatOpen] = useState(false);

  const mobileMenuIcons = useMemo(() => [Home, List, Tag, Percent, Monitor], []);
  const navRoutes = useMemo(
    () => ["/", "/products", "/rent", "/about", "/contacts"],
    []
  );
  const router = useRouter();
  const pathname = usePathname() || "/";

  // --- ЛОГИКА ШИРИНЫ МЕНЮ ДЛЯ 100+ КАТЕГОРИЙ ---
  const getDropdownClass = () => {
    const count = categories.length;
    if (count > 20) return "w-[800px] grid-cols-3"; // 3 колонки (Очень много)
    if (count > 8) return "w-[550px] grid-cols-2";  // 2 колонки (Средне)
    return "w-[280px] grid-cols-1";                 // 1 колонка (Мало)
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
      {/* --- TOP BAR (PC Only) --- */}
      <div className="bg-gray-100 border-b border-gray-200 text-[11px] text-gray-600 py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <span className="flex items-center gap-1">
              <MapPin size={12} /> {t.topbar.addressShort}
            </span>
            <a href="tel:+994552677811" className="hover:text-amber-600 font-bold transition flex items-center gap-1">
              <Phone size={12} /> (+994 55) 267 78 11
            </a>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button type="button" onClick={() => switchLang("az")} className={`font-bold hover:text-gray-900 ${lang === "az" ? "text-gray-900" : "text-gray-400"}`}>AZ</button>
              <button type="button" onClick={() => switchLang("ru")} className={`font-bold hover:text-gray-900 ${lang === "ru" ? "text-gray-900" : "text-gray-400"}`}>RU</button>
            </div>
          </div>
        </div>
      </div>

      {/* --- HEADER --- */}
      <header className="bg-white sticky top-0 z-50 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-5">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 md:items-center">
            
            {/* Logo */}
            <div className="flex justify-between items-center">
              <Link href={`/${lang}`} className="flex flex-col leading-none shrink-0 group">
                <span className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter group-hover:opacity-80 transition">
                  MD <span className="text-amber-600">BAKU</span>
                </span>
                <span className="text-[9px] md:text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase pl-0.5">
                  Professional Detectors
                </span>
              </Link>
              <div className="flex items-center gap-4 md:hidden">
                <a href="tel:+994552677811" className="text-gray-800 w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full">
                  <Phone size={20} />
                </a>
                <button type="button" onClick={() => setMenuOpen(!menuOpen)} className="text-gray-800">
                  {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 w-full md:max-w-2xl">
              <div className="hidden md:flex w-full shadow-sm hover:shadow-md transition-shadow rounded-full">
                <input type="text" placeholder={t.header.searchPlaceholder} className="flex-1 h-[46px] border border-r-0 border-gray-200 rounded-l-full px-6 text-sm focus:outline-none focus:border-amber-500 bg-gray-50 focus:bg-white transition-all" />
                <button className="bg-gray-900 text-white h-[46px] px-8 rounded-r-full hover:bg-amber-600 transition-colors flex items-center justify-center">
                  <Search size={20} />
                </button>
              </div>
              <div className="flex md:hidden w-full relative">
                <input type="text" placeholder={t.header.searchPlaceholder} className="w-full h-10 border border-gray-200 rounded-lg pl-3 pr-10 text-xs focus:outline-none focus:border-amber-500 bg-gray-50" />
                <button className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-gray-400">
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* PC Actions */}
            <div className="hidden md:flex items-center gap-6 ml-auto">
              <button className="flex flex-col items-center group text-gray-500 hover:text-amber-600 transition relative">
                <div className="relative">
                  <Heart size={24} className="mb-1 group-hover:-translate-y-1 transition-transform duration-300" strokeWidth={1.5} />
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-amber-600 text-white text-[9px] flex items-center justify-center rounded-full animate-pulse">0</span>
                </div>
                <span className="text-[10px] uppercase font-bold">{t.header.favorites}</span>
              </button>
              <button className="flex flex-col items-center group text-gray-500 hover:text-amber-600 transition relative">
                <div className="relative">
                  <ShoppingBag size={24} className="mb-1 group-hover:-translate-y-1 transition-transform duration-300" strokeWidth={1.5} />
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-gray-900 text-white text-[9px] flex items-center justify-center rounded-full">0</span>
                </div>
                <span className="text-[10px] uppercase font-bold">{t.header.cart}</span>
              </button>
            </div>
          </div>
        </div>

        {/* --- NAVBAR (PC) --- */}
        <nav className="border-t border-gray-100 bg-white hidden lg:block relative">
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex items-center gap-8 text-[13px] font-bold uppercase tracking-wide text-gray-900 h-12">
              
              {/* MEGA MENU TRIGGER */}
              <li 
                className="flex items-center gap-2 pr-6 border-r border-gray-100 cursor-pointer hover:text-amber-600 h-full group transition-colors relative"
                onMouseEnter={() => setIsCatOpen(true)}
                onMouseLeave={() => setIsCatOpen(false)}
              >
                <div className="flex items-center gap-2 py-4">
                    <Menu size={18} className={`transition-transform duration-300 ${isCatOpen ? 'rotate-90 text-amber-600' : ''}`} />
                    <span>{t.header.allCategories}</span>
                </div>

                {/* --- MEGA MENU DROPDOWN --- */}
                {/* Динамическая ширина и сетка */}
                <div 
                    className={`absolute top-full left-0 bg-white shadow-xl border border-gray-100 rounded-b-xl overflow-hidden transition-all duration-300 transform origin-top z-50 ${
                        isCatOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
                    } ${getDropdownClass()}`}
                >
                    {/* Скролл для 100+ категорий: max-h-[65vh] */}
                    <div className="max-h-[65vh] overflow-y-auto custom-scrollbar p-2 grid gap-1">
                        {categories.map((cat) => (
                            <Link 
                                key={cat.id} 
                                href={`/${lang}/catalog/${cat.slug}`}
                                className="flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-amber-50 hover:text-amber-600 transition-colors group/item"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover/item:bg-amber-600 transition-colors" />
                                    <span className="text-xs font-bold leading-tight">{cat.title}</span>
                                </div>
                                {/* На больших меню стрелку можно убрать для чистоты, или оставить */}
                            </Link>
                        ))}
                        {categories.length === 0 && (
                            <div className="col-span-full px-6 py-8 text-xs text-gray-400 text-center">
                                Категории загружаются...
                            </div>
                        )}
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

        {/* --- MOBILE MENU --- */}
        {menuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-2xl h-[calc(100vh-120px)] overflow-y-auto z-50 animate-fade-in-down">
            <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-100">
              <div className="flex bg-white rounded-md border border-gray-200 p-1">
                <button type="button" onClick={() => switchLang("az")} className={`px-4 py-1.5 rounded text-xs font-bold transition ${lang === "az" ? "bg-amber-600 text-white" : "text-gray-600"}`}>AZ</button>
                <button type="button" onClick={() => switchLang("ru")} className={`px-4 py-1.5 rounded text-xs font-bold transition ${lang === "ru" ? "bg-amber-600 text-white" : "text-gray-600"}`}>RU</button>
              </div>
            </div>

            <div className="py-2">
              
              {/* MOBILE: CATEGORIES LIST */}
              <div className="mb-2">
                 <div className="px-5 py-3 text-[10px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-2 bg-gray-50/50">
                    <Layers size={14} /> {t.header.allCategories}
                 </div>
                 
                 {/* Скролл для мобилки: max-h-[300px] */}
                 <div className="max-h-[300px] overflow-y-auto border-b border-gray-100">
                     {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/${lang}/catalog/${cat.slug}`}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:text-amber-600 active:bg-gray-50"
                        >
                            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                            {cat.title}
                        </Link>
                     ))}
                 </div>
              </div>

              {/* MOBILE: MAIN NAV */}
              {t.nav.map((item, i) => {
                const Icon = mobileMenuIcons[i] || ChevronRight;
                return (
                  <Link
                    key={i}
                    href={`/${lang}${navRoutes[i]}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 font-bold text-gray-800 hover:text-amber-600 hover:bg-amber-50 border-b border-gray-50 last:border-0 text-sm transition"
                  >
                    <Icon size={20} className="text-gray-400" />
                    {item}
                    <ChevronRight size={16} className="ml-auto text-gray-300" />
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