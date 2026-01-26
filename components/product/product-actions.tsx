"use client";

import { useState } from "react";
import { Share2, ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/context/cart-context";

// --- 1. Кнопка "Поделиться" ---
export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="text-slate-400 hover:text-slate-900 transition p-2 hover:bg-slate-50 rounded-full active:scale-90 relative"
      title="Поделиться"
    >
      {copied ? <Check size={18} className="text-emerald-500" /> : <Share2 size={18} />}
      {copied && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap">
          Copied!
        </span>
      )}
    </button>
  );
}

// --- 2. Кнопка "В корзину" (Основная) ---
type AddToCartProps = {
  id: number;
  slug: string;
  image: string | null;
  text: string;
  price: number;
  title: string;
  className?: string;
};

export function AddToCartButton({ id, slug, image, text, price, title, className }: AddToCartProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = () => {
    addToCart({ id, title, price, slug, image });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <button 
      onClick={handleClick}
      className={`${className} transition-colors duration-300 ${isAdded ? "!bg-emerald-600 !text-white !border-emerald-600" : ""}`}
    >
      {isAdded ? (
        <>
          <Check size={20} className="animate-in zoom-in" /> Added
        </>
      ) : (
        <>
          <ShoppingCart size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          {text}
        </>
      )}
    </button>
  );
}

// --- 3. Кнопка "Купить сейчас" (Мобильная) ---
export function BuyNowButton({ text, product }: { text: string, product: any }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = () => {
     addToCart({ 
         id: product.id, 
         title: product.title, 
         price: product.price, 
         slug: product.slug, 
         image: product.image 
     });
     // Здесь можно добавить router.push('/cart') для перехода в корзину
     setIsAdded(true);
     setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <button 
      onClick={handleClick}
      className={`flex-[2] h-12 rounded-xl font-bold uppercase tracking-wider text-sm shadow-lg shadow-slate-900/20 active:scale-95 transition-transform flex items-center justify-center gap-2 ${
          isAdded ? "bg-emerald-600 text-white" : "bg-slate-900 text-white"
      }`}
    >
      {isAdded ? <Check size={18} /> : <ShoppingCart size={18} />}
      {text}
    </button>
  );
}