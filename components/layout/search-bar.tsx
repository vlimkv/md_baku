"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Lang } from "@/lib/data";

type Props = {
  lang: Lang;
  placeholder: string;
};

export function SearchBar({ lang, placeholder }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Берем начальное значение из URL, если есть
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = () => {
    // Даже если запрос пустой, переходим на страницу товаров, но сбрасываем фильтр
    const params = new URLSearchParams(); // Создаем чистые параметры, или можно сохранить текущие
    
    if (query.trim()) {
      params.set("search", query.trim());
    }
    
    // Сбрасываем страницу на 1
    params.set("page", "1");

    router.push(`/${lang}/products?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative w-full group">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full h-11 md:h-[46px] pl-11 pr-4 rounded-xl md:rounded-full bg-gray-100 md:bg-gray-50 border border-transparent md:border-gray-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all shadow-inner md:shadow-none"
      />
      <button 
        onClick={handleSearch}
        className="absolute left-0 top-0 h-full w-11 flex items-center justify-center text-slate-400 group-focus-within:text-amber-600 transition-colors"
      >
        <Search size={20} strokeWidth={2.5} />
      </button>
    </div>
  );
}