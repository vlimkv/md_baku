"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { PublicProduct } from "@/lib/actions/public";
import type { Lang } from "@/lib/data";

type Props = {
  products: PublicProduct[];
  lang: Lang;
};

export function HeroSlider({ products, lang }: Props) {
  const [current, setCurrent] = useState(0);
  
  // Для сброса таймера при ручном переключении
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    if (products.length <= 1) return;
    
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 5000);

    return () => resetTimeout();
  }, [current, products.length]);

  if (!products || products.length === 0) return null;

  const activeProduct = products[current];

  // Ручное переключение
  const handleDotClick = (idx: number) => {
    setCurrent(idx);
  };

  return (
    <div className="relative bg-[#111] overflow-hidden text-white transition-all duration-500">
      
      {/* --- BACKGROUND (Размытие) --- */}
      {/* На мобильном делаем фон темнее для читаемости */}
      <div key={current} className="absolute inset-0 z-0 animate-fade-in">
         {activeProduct.image && (
            <Image 
                src={activeProduct.image} 
                alt="bg" 
                fill 
                className="object-cover opacity-20 md:opacity-30 blur-2xl md:blur-3xl scale-110" 
                priority
            />
         )}
         <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#111] md:bg-gradient-to-r md:from-black/90 md:via-black/60 md:to-transparent" />
      </div>

      {/* --- CONTENT CONTAINER --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 pt-24 pb-16 md:py-32 min-h-[600px] md:min-h-[700px] justify-center">
            
            {/* 1. IMAGE (На мобильном идет ПЕРВЫМ - order-1, на ПК ВТОРЫМ - md:order-2) */}
            <div className="order-1 md:order-2 flex-1 w-full flex justify-center md:justify-end relative">
                <div className="relative w-[280px] h-[280px] md:w-full md:max-w-lg md:h-[500px] aspect-square">
                    {activeProduct.image ? (
                        <Image 
                            src={activeProduct.image} 
                            alt={activeProduct.title} 
                            fill
                            className="object-contain drop-shadow-2xl animate-float"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5 rounded-3xl">
                            NO IMG
                        </div>
                    )}
                </div>
            </div>

            {/* 2. TEXT (На мобильном ВТОРОЙ - order-2, на ПК ПЕРВЫЙ - md:order-1) */}
            <div className="order-2 md:order-1 flex-1 space-y-4 md:space-y-6 text-center md:text-left max-w-2xl">
                
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-600/20 text-amber-500 border border-amber-600/30 text-[10px] md:text-xs font-bold uppercase tracking-widest animate-fade-in-up">
                    {lang === 'ru' ? 'Рекомендуем' : 'Tövsiyə edirik'}
                </div>
                
                {/* Title (Адаптивный шрифт) */}
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-black leading-[1.1] tracking-tight text-white drop-shadow-lg min-h-[2.2em] md:min-h-0 flex flex-col justify-center">
                    {activeProduct.title}
                </h1>
                
                {/* Price */}
                <div className="text-2xl md:text-4xl font-bold text-amber-500">
                    {activeProduct.price} <span className="text-base md:text-lg text-white/60 font-medium">{activeProduct.currency}</span>
                </div>

                {/* Button */}
                <div className="flex flex-col md:flex-row items-center gap-4 pt-4 justify-center md:justify-start">
                    <Link 
                        href={`/${lang}/products/${activeProduct.slug}`}
                        className="w-full md:w-auto bg-amber-600 hover:bg-amber-500 text-white px-8 py-3.5 md:py-4 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-amber-600/20"
                    >
                        {lang === 'ru' ? 'Подробнее' : 'Ətraflı'} <ArrowRight size={20} />
                    </Link>
                </div>
            </div>

        </div>

        {/* --- DOTS NAVIGATION --- */}
        <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {products.map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => handleDotClick(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                        current === idx ? "w-8 bg-amber-500" : "w-2 bg-white/20 hover:bg-white/40"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                />
            ))}
        </div>
      </div>
    </div>
  );
}