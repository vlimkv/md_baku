"use client";

import { useCart } from "@/lib/context/cart-context";
import { X, Trash2, Plus, Minus, ArrowRight, PackageOpen } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Lang } from "@/lib/data";

const PHONE_NUMBER = "994552677811"; 

const translations = {
  ru: {
    title: "Ваша корзина",
    emptyTitle: "В корзине пусто",
    emptyDesc: "Загляните в каталог, там много интересного!",
    toCatalog: "Перейти к покупкам",
    subtotal: "Итого",
    shippingNote: "Менеджер уточнит детали доставки в чате",
    checkout: "Заказать в WhatsApp",
    currency: "₼",
    waGreeting: "Здравствуйте! Я хочу оформить заказ:",
    waTotal: "Общая сумма"
  },
  az: {
    title: "Sizin səbətiniz",
    emptyTitle: "Səbət boşdur",
    emptyDesc: "Kataloqa baxın, orada maraqlı məhsullar var!",
    toCatalog: "Alış-verişə başla",
    subtotal: "Cəmi",
    shippingNote: "Menecer çatdırılma detallarını çatda dəqiqləşdirəcək",
    checkout: "WhatsApp-da sifariş et",
    currency: "₼",
    waGreeting: "Salam! Mən sifariş vermək istəyirəm:",
    waTotal: "Ümumi məbləğ"
  }
};

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="mr-2 mb-0.5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

type Props = {
  lang: Lang;
};

export function CartDrawer({ lang }: Props) {
  const { items, cartOpen, setCartOpen, addToCart, decreaseCartQuantity, removeFromCart, totalPrice } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen]);

  const t = translations[lang] || translations.ru;

  // --- ГЕНЕРАЦИЯ ССЫЛКИ WHATSAPP ---
  const getWhatsAppLink = () => {
    const origin = window.location.origin;
    
    let message = `${t.waGreeting}\n\n`;

    items.forEach((item, index) => {
      const productUrl = `${origin}/${lang}/products/${item.slug}`;

      // 1. Товар - Цена
      message += `${index + 1}. *${item.title}*\n`;
      message += `   ${item.quantity} x ${item.price} = ${item.price * item.quantity} ${t.currency}\n`;
      // Ссылка на товар
      message += `   🔗 ${productUrl}\n\n`;
    });

    message += `------------------\n${t.waTotal}: *${totalPrice} ${t.currency}*`;

    return `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  if (!isMounted) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[99] transition-opacity duration-500 ${
          cartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setCartOpen(false)}
      />

      <div 
        className={`fixed top-0 right-0 h-[100dvh] w-full max-w-[450px] bg-white z-[100] shadow-2xl transform transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) flex flex-col ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 md:px-6 md:py-5 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-lg md:text-xl font-black text-slate-900 flex items-center gap-3">
            {t.title}
            <span className="flex items-center justify-center bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          </h2>
          <button 
            onClick={() => setCartOpen(false)} 
            className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-slate-900 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-500">
               <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                 <PackageOpen size={40} strokeWidth={1.5} className="md:w-12 md:h-12" />
               </div>
               <div className="max-w-[250px]">
                 <p className="text-lg md:text-xl font-bold text-slate-900 mb-2">{t.emptyTitle}</p>
                 <p className="text-sm text-gray-500 leading-relaxed">{t.emptyDesc}</p>
               </div>
               <button 
                 onClick={() => setCartOpen(false)}
                 className="group flex items-center gap-2 text-amber-600 font-bold text-sm uppercase tracking-wider hover:text-amber-700 transition-colors"
               >
                 {t.toCatalog} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-6">
              {items.map((item) => (
                <div key={item.id} className="group relative flex gap-3 md:gap-5 animate-in slide-in-from-right-8 duration-500">
                  <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 bg-white rounded-xl md:rounded-2xl border border-gray-100 p-2 flex items-center justify-center relative overflow-hidden">
                    {item.image ? (
                      <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" 
                      />
                    ) : (
                      <div className="text-[10px] text-gray-300 font-bold">NO PHOTO</div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate max-w-[120px]">
                           {item.category_title || ""}
                         </span>
                         
                         <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-rose-500 transition-colors p-2 -mr-2 -mt-2 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                          title="Удалить"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <Link href={`/${lang}/products/${item.slug}`} onClick={() => setCartOpen(false)}>
                          <h3 className="text-xs md:text-sm font-bold text-slate-900 leading-snug hover:text-amber-600 transition-colors line-clamp-2 pr-4">
                          {item.title}
                          </h3>
                      </Link>
                    </div>

                    <div className="flex items-center justify-between mt-2 md:mt-3">
                      <div className="text-sm md:text-base font-black text-slate-900">
                         {new Intl.NumberFormat('ru-RU').format(item.price * item.quantity)} <span className="text-xs md:text-sm font-bold text-gray-400">{t.currency}</span>
                      </div>
                      
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full h-7 md:h-8 px-1 shadow-sm">
                        <button 
                          onClick={() => decreaseCartQuantity(item.id)}
                          className="w-6 md:w-7 h-full flex items-center justify-center text-gray-500 hover:text-amber-600 transition disabled:opacity-30 active:scale-90"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={12} strokeWidth={2.5} />
                        </button>
                        <span className="text-xs font-bold w-5 md:w-6 text-center tabular-nums text-slate-900 select-none">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => addToCart(item)}
                          className="w-6 md:w-7 h-full flex items-center justify-center text-gray-500 hover:text-amber-600 transition active:scale-90"
                        >
                          <Plus size={12} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 md:p-6 bg-gray-50 border-t border-gray-100 pb-8 md:pb-6">
            <div className="space-y-3 mb-4 md:mb-6">
                <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">{t.subtotal}:</span>
                    <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                        {new Intl.NumberFormat('ru-RU').format(totalPrice)} {t.currency}
                    </span>
                </div>
                <p className="text-[10px] md:text-xs text-center text-gray-400">
                    {t.shippingNote}
                </p>
            </div>
            
            <a 
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center h-12 md:h-14 bg-[#25D366] text-white rounded-xl md:rounded-2xl font-bold uppercase tracking-wider hover:bg-[#20bd5a] active:bg-[#1da850] transition-all duration-300 shadow-xl shadow-[#25D366]/20 active:scale-[0.98] text-sm md:text-base"
                onClick={() => setCartOpen(false)}
            >
              <WhatsAppIcon />
              {t.checkout}
            </a>
          </div>
        )}
      </div>
    </>
  );
}