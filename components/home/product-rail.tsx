"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import type { PublicProduct } from "@/lib/actions/public";
import type { Lang } from "@/lib/data";

type Props = {
  title: string;
  products: PublicProduct[];
  lang: Lang;
  collectionKey?: string; // Чтобы сделать ссылку "Смотреть все" (опционально)
};

export function ProductRail({ title, products, lang }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!products || products.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === "left" ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 border-b border-gray-100 last:border-0">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Заголовок и навигация */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {title}
          </h2>
          
          <div className="flex gap-2">
            <button 
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-slate-500 hover:border-amber-500 hover:text-amber-600 transition hidden md:flex"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-slate-500 hover:border-amber-500 hover:text-amber-600 transition hidden md:flex"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Слайдер (Scroll Snap) */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide snap-x snap-mandatory"
        >
          {products.map((product) => (
            <div key={product.id} className="min-w-[160px] w-[160px] md:min-w-[260px] md:w-[260px] snap-start">
              <ProductCard product={product} lang={lang} />
            </div>
          ))}
          
          {/* Карточка "Смотреть все" в конце */}
          <div className="min-w-[160px] md:min-w-[260px] flex items-center justify-center snap-start">
             <Link 
               href={`/${lang}/products`} 
               className="flex flex-col items-center justify-center w-full h-full bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-amber-500 hover:text-amber-600 transition gap-2 group aspect-[3/4] md:aspect-auto"
             >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <ArrowRight size={24} />
                </div>
                <span className="font-bold text-sm">
                    {lang === 'ru' ? 'Смотреть все' : 'Hamısına bax'}
                </span>
             </Link>
          </div>
        </div>

      </div>
    </section>
  );
}