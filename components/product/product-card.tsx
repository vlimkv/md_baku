"use client";

import Link from "next/link";
import { PublicProduct } from "@/lib/actions/public";
import { Lang } from "@/lib/data";
import { useCart } from "@/lib/context/cart-context";
import { ShoppingBag, Check, Plus } from "lucide-react";
import { useState } from "react";

type Props = {
  product: PublicProduct;
  lang: Lang;
};

export function ProductCard({ product, lang }: Props) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    addToCart(product);
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Link 
      href={`/${lang}/products/${product.slug}`}
      className="group bg-white rounded-2xl md:rounded-3xl border border-gray-200 p-2.5 md:p-4 flex flex-col hover:shadow-xl hover:shadow-gray-200/50 hover:border-amber-300 transition-all duration-300 relative overflow-hidden h-full"
    >
      {/* Бейдж (Уменьшен на мобилке) */}
      {product.badge && (
        <span className="absolute top-2 left-2 md:top-4 md:left-4 bg-slate-900 text-white text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded z-10">
          {product.badge}
        </span>
      )}

      {/* Картинка (Уменьшен отступ снизу) */}
      <div className="aspect-square relative bg-gray-50 rounded-xl md:rounded-2xl mb-2 md:mb-4 overflow-hidden flex items-center justify-center p-2 md:p-4">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <span className="text-gray-300 text-[10px] font-bold">NO IMG</span>
        )}
      </div>

      {/* Контент */}
      <div className="flex-1 flex flex-col">
        {/* Категория */}
        <div className="text-[9px] md:text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1 line-clamp-1 opacity-80">
          {product.category_title}
        </div>
        
        {/* Название (text-xs на мобиле, min-h для выравнивания) */}
        <h3 className="text-xs md:text-sm font-bold text-gray-900 leading-tight line-clamp-2 mb-2 md:mb-3 group-hover:text-amber-600 transition-colors min-h-[2.5em]">
          {product.title}
        </h3>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="flex flex-col">
            {product.old_price && (
              <div className="text-[10px] md:text-xs text-gray-400 line-through font-medium -mb-0.5">
                {product.old_price} {product.currency}
              </div>
            )}
            {/* Цена (text-sm на мобиле, text-lg на ПК) */}
            <div className="text-sm md:text-lg font-black text-gray-900 leading-none">
              {product.price} <span className="text-[10px] md:text-sm text-gray-400 font-bold">{product.currency}</span>
            </div>
          </div>

          {/* Кнопка (32px на мобиле, 40px на ПК) */}
          <button
            onClick={handleAdd}
            disabled={!product.in_stock}
            className={`w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-lg md:rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm md:shadow-md ${
                !product.in_stock 
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed" 
                  : isAdded 
                    ? "bg-emerald-500 text-white scale-105"
                    : "bg-slate-900 text-white hover:bg-amber-600 hover:scale-105 active:scale-95"
            }`}
          >
            {isAdded ? (
                <Check className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={3} />
            ) : (
                <Plus className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}