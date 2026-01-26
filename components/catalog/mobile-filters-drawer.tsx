"use client";

import { useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { CatalogFilters } from "./catalog-filters";
import { Lang } from "@/lib/data";

type Props = {
  lang: Lang;
  activeCount: number; // Количество активных фильтров для бейджика
};

export function MobileFiltersDrawer({ lang, activeCount }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  // Блокируем скролл страницы при открытой шторке
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* КНОПКА ОТКРЫТИЯ (Видна только на мобиле) */}
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-white border border-gray-200 text-slate-900 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-transform"
      >
        <SlidersHorizontal size={16} />
        <span>{lang === 'ru' ? 'Фильтры' : 'Filtrlər'}</span>
        {activeCount > 0 && (
          <span className="bg-amber-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">
            {activeCount}
          </span>
        )}
      </button>

      {/* ЗАТЕМНЕНИЕ ФОНА */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[99] transition-opacity duration-300 backdrop-blur-sm lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* ШТОРКА (Slide-over) */}
      <div 
        className={`fixed inset-y-0 right-0 w-full max-w-[320px] bg-[#F8F9FA] z-[100] shadow-2xl transform transition-transform duration-300 ease-out lg:hidden flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER ШТОРКИ */}
        <div className="flex items-center justify-between p-5 bg-white border-b border-gray-100">
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide">
            {lang === 'ru' ? 'Фильтры и Сортировка' : 'Filtr və Sıralama'}
          </h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-full text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* КОНТЕНТ ШТОРКИ */}
        <div className="flex-1 overflow-y-auto p-5">
           <CatalogFilters lang={lang} onClose={() => setIsOpen(false)} />
        </div>
      </div>
    </>
  );
}