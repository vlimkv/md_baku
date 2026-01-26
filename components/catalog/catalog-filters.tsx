"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Check, X } from "lucide-react";

type Props = {
  lang: "ru" | "az";
  onClose?: () => void; // 👇 Добавили коллбек для закрытия шторки
};

const DICT = {
  ru: {
    filters: "Фильтры",
    price: "Цена (AZN)",
    min: "от",
    max: "до",
    stock: "Только в наличии",
    apply: "Применить",
    reset: "Сбросить",
    sort: "Сортировка",
    sortOptions: {
      popular: "По популярности",
      new: "Сначала новые",
      price_asc: "Сначала дешевые",
      price_desc: "Сначала дорогие",
    }
  },
  az: {
    filters: "Filtrlər",
    price: "Qiymət (AZN)",
    min: "min",
    max: "maks",
    stock: "Anbarda var",
    apply: "Tətbiq et",
    reset: "Sıfırla",
    sort: "Sıralama",
    sortOptions: {
      popular: "Populyarlığa görə",
      new: "Yenilər",
      price_asc: "Ucuzdan bahaya",
      price_desc: "Bahadan ucuz",
    }
  }
};

export function CatalogFilters({ lang, onClose }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = DICT[lang];

  const [minPrice, setMinPrice] = useState(searchParams.get("min") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max") || "");
  const [inStock, setInStock] = useState(searchParams.get("stock") === "1");
  const [sort, setSort] = useState(searchParams.get("sort") || "popular");

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (minPrice) params.set("min", minPrice); else params.delete("min");
    if (maxPrice) params.set("max", maxPrice); else params.delete("max");
    if (inStock) params.set("stock", "1"); else params.delete("stock");
    if (sort && sort !== "popular") params.set("sort", sort); else params.delete("sort");

    router.push(`?${params.toString()}`, { scroll: false });
    
    // Закрываем шторку если передан коллбек
    if (onClose) onClose();
  };

  const resetFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setInStock(false);
    setSort("popular");
    
    const params = new URLSearchParams(searchParams.toString());
    const category = params.get("category");
    
    if (category) {
        router.push(`?category=${category}`);
    } else {
        router.push("?");
    }
    if (onClose) onClose();
  };

  const hasActiveFilters = minPrice || maxPrice || inStock || sort !== "popular";

  return (
    <div className="space-y-6 pb-20 lg:pb-0"> {/* Отступ снизу для мобилки чтобы кнопка не перекрывала контент */}
      
      {/* 1. Сортировка */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">{t.sort}</h3>
        <select 
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            // На десктопе применяем сразу, на мобильном ждем кнопку "Применить"
            if (!onClose) {
                const params = new URLSearchParams(searchParams.toString());
                params.set("sort", e.target.value);
                params.set("page", "1");
                router.push(`?${params.toString()}`, { scroll: false });
            }
          }}
          className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm font-medium focus:outline-none focus:border-amber-500 cursor-pointer"
        >
          <option value="popular">{t.sortOptions.popular}</option>
          <option value="new">{t.sortOptions.new}</option>
          <option value="price_asc">{t.sortOptions.price_asc}</option>
          <option value="price_desc">{t.sortOptions.price_desc}</option>
        </select>
      </div>

      {/* 2. Фильтры */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-6">
        <div className="flex justify-between items-center lg:hidden">
             <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.filters}</h3>
             {onClose && <button onClick={onClose}><X className="text-gray-400" /></button>}
        </div>
        <h3 className="hidden lg:block text-xs font-bold uppercase tracking-wider text-gray-400">{t.filters}</h3>

        {/* Цена */}
        <div>
          <label className="text-sm font-bold text-gray-900 mb-2 block">{t.price}</label>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              placeholder={t.min} 
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-amber-500 outline-none transition"
            />
            <span className="text-gray-400 font-bold">-</span>
            <input 
              type="number" 
              placeholder={t.max} 
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-amber-500 outline-none transition"
            />
          </div>
        </div>

        {/* Наличие */}
        <label className="flex items-center gap-3 cursor-pointer group select-none">
            <div 
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    inStock ? "bg-amber-600 border-amber-600 text-white" : "bg-white border-gray-300 group-hover:border-amber-500"
                }`}
            >
                {inStock && <Check size={14} strokeWidth={3} />}
            </div>
            <input 
                type="checkbox" 
                className="hidden" 
                checked={inStock} 
                onChange={() => setInStock(!inStock)} 
            />
            <span className="text-sm font-medium text-gray-700 group-hover:text-amber-600 transition-colors">
                {t.stock}
            </span>
        </label>

        {/* Кнопки (Sticky on mobile) */}
        <div className="lg:static fixed bottom-0 left-0 w-full lg:w-auto p-4 lg:p-0 bg-white border-t border-gray-100 lg:border-0 z-20 flex flex-col gap-2">
            <button 
                onClick={applyFilters}
                className="w-full h-12 lg:h-11 bg-slate-900 text-white rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-amber-600 transition-colors active:scale-95 shadow-xl lg:shadow-none"
            >
                {t.apply}
            </button>
            {hasActiveFilters && (
                <button 
                    onClick={resetFilters}
                    className="w-full h-9 text-gray-400 hover:text-rose-500 font-bold text-xs transition-colors"
                >
                    {t.reset}
                </button>
            )}
        </div>
      </div>
    </div>
  );
}