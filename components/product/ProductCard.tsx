"use client";

import Link from "next/link";
import { ShoppingCart, Check, X, Layers } from "lucide-react";
import type { PublicProduct } from "@/lib/actions/public";
import type { Lang } from "@/lib/data";

type Props = {
  product: PublicProduct;
  lang: Lang;
};

export function ProductCard({ product, lang }: Props) {
  const discount = product.old_price 
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100) 
    : 0;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 hover:border-amber-200 hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col h-full">
      
      {/* Ссылка на карточку */}
      <Link href={`/${lang}/products/${product.slug}`} className="absolute inset-0 z-10" />

      {/* ИЗОБРАЖЕНИЕ */}
      <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden p-4 flex items-center justify-center">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.title} 
            className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="text-gray-300 text-xs font-bold uppercase tracking-widest">No Image</div>
        )}

        {/* Бейджи (Скидка / Новинка) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
            {product.badge && (
                <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
                    {product.badge}
                </span>
            )}
            {discount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
                    -{discount}%
                </span>
            )}
        </div>
      </div>

      {/* КОНТЕНТ */}
      <div className="p-5 flex flex-col flex-1">
        
        {/* --- НОВОЕ: Название категории --- */}
        <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
           <Layers size={12} />
           <span className="truncate">{product.category_title}</span>
        </div>

        {/* Название товара */}
        <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2 group-hover:text-amber-600 transition-colors line-clamp-2 min-h-[40px]">
          {product.title}
        </h3>

        <div className="mt-auto pt-4 flex items-end justify-between border-t border-gray-50">
          <div>
             {/* Цена */}
             <div className="flex items-center gap-2">
                <span className="text-lg font-black text-gray-900">
                    {product.price} <span className="text-xs">{product.currency}</span>
                </span>
                {product.old_price && (
                    <span className="text-xs font-bold text-gray-400 line-through decoration-rose-400/50">
                        {product.old_price}
                    </span>
                )}
             </div>
             
             {/* Статус наличия */}
             <div className={`text-[10px] font-bold uppercase tracking-wider mt-1 flex items-center gap-1 ${product.in_stock ? 'text-emerald-600' : 'text-rose-500'}`}>
                {product.in_stock 
                  ? <><Check size={12} strokeWidth={3} /> {lang === 'ru' ? 'В наличии' : 'Anbarda'}</> 
                  : <><X size={12} strokeWidth={3} /> {lang === 'ru' ? 'Нет в наличии' : 'Bitib'}</>
                }
             </div>
          </div>

          {/* Кнопка корзины */}
          <button className="z-20 w-10 h-10 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-colors">
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}