"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/context/cart-context";
import { useEffect, useState } from "react";
// Link больше не нужен

export function FloatingCart({ className = "bottom-24" }: { className?: string }) {
  // 👇 ДОСТАЕМ setCartOpen ИЗ КОНТЕКСТА
  const { totalItems, setCartOpen } = useCart(); 
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (totalItems === 0) return null;

  return (
    <div 
      className={`fixed right-4 z-[60] md:hidden transition-all duration-500 ${className} ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <button 
        onClick={() => setCartOpen(true)}
        className="relative w-14 h-14 bg-slate-900 text-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex items-center justify-center active:scale-90 transition-transform border border-slate-700"
      >
        <ShoppingCart size={24} />
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-amber-600 border-2 border-white text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-in zoom-in">
          {totalItems}
        </span>
      </button>
    </div>
  );
}