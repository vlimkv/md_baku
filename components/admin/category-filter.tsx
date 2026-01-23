"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";

type CategoryOption = { id: number; title: string };

export function CategoryFilter({ categories }: { categories: CategoryOption[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCat = searchParams.get("category") || "all";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    // Сбрасываем страницу на 1 при смене фильтра
    params.set("page", "1");

    if (val === "all") {
      params.delete("category");
    } else {
      params.set("category", val);
    }

    router.push(`/admin/products?${params.toString()}`);
  };

  return (
    <div className="relative group">
      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
      <select
        value={currentCat}
        onChange={handleChange}
        className="h-12 pl-10 pr-8 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none appearance-none transition-all cursor-pointer min-w-[180px]"
      >
        <option value="all">Все категории</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.title}
          </option>
        ))}
      </select>
      {/* Кастомная стрелочка */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}