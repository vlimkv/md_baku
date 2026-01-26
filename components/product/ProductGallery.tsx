"use client";

import { useState, useRef, MouseEvent } from "react";
import { Search } from "lucide-react";

type MediaItem = {
  url: string;
  kind: "image" | "video";
};

type Props = {
  media: MediaItem[];
  title: string;
};

export function ProductGallery({ media, title }: Props) {
  // Если медиа нет, ставим заглушку
  const items = media.length > 0 ? media : [{ url: "/placeholder.png", kind: "image" }];
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({ opacity: 0, transform: "scale(1)", transformOrigin: "center" });
  
  const containerRef = useRef<HTMLDivElement>(null);

  // --- ЛОГИКА ЗУМА (Только ПК) ---
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    // Координаты курсора внутри блока (в %)
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      opacity: 1,
      transform: "scale(2)", // Увеличение в 2 раза
      transformOrigin: `${x}% ${y}%`, // Смещение точки зума за курсором
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      opacity: 0,
      transform: "scale(1)",
      transformOrigin: "center",
    });
  };

  const activeItem = items[activeIndex] as MediaItem; // Типизация

  return (
    <div className="flex flex-col gap-4 select-none">
      
      {/* === MAIN IMAGE CONTAINER === */}
      {/* relative и overflow-hidden держат картинку в рамке */}
      <div 
        ref={containerRef}
        className="group relative aspect-square w-full bg-white rounded-3xl border border-gray-100 overflow-hidden cursor-zoom-in touch-pan-y"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Хинт "Лупа" (исчезает при зуме) */}
        <div className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur p-2 rounded-full text-slate-400 opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
           <Search size={18} />
        </div>

        {/* 1. Базовая картинка (видна всегда) */}
        <img 
          src={activeItem.url} 
          alt={title} 
          className={`absolute inset-0 w-full h-full object-contain p-4 transition-opacity duration-300 ${zoomStyle.opacity === 1 ? 'opacity-0' : 'opacity-100'}`}
        />

        {/* 2. Зум-версия (появляется на ПК при наведении) */}
        {/* hidden md:block убирает зум на мобилках */}
        <div className="hidden md:block absolute inset-0 w-full h-full pointer-events-none">
            <img 
              src={activeItem.url} 
              alt={title} 
              className="w-full h-full object-contain transition-transform duration-100 ease-out"
              style={{
                transform: zoomStyle.transform,
                transformOrigin: zoomStyle.transformOrigin,
                opacity: zoomStyle.opacity
              }}
            />
        </div>
      </div>

      {/* === THUMBNAILS === */}
      {items.length > 1 && (
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto pb-2 px-1 scrollbar-hide snap-x">
            {items.map((item: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative flex-shrink-0 w-20 h-20 snap-start rounded-xl border-2 overflow-hidden bg-white p-1 transition-all duration-300 ${
                  activeIndex === idx 
                    ? "border-amber-500 shadow-md scale-100 ring-2 ring-amber-100" 
                    : "border-gray-100 opacity-70 hover:opacity-100 hover:border-gray-300 scale-95"
                }`}
              >
                <img 
                  src={item.url} 
                  alt={`${title} ${idx}`} 
                  className="object-contain w-full h-full"
                />
              </button>
            ))}
          </div>
          {/* Градиент, чтобы показать, что можно скроллить (если много фото) */}
          <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-[#F8F9FA] to-transparent pointer-events-none md:hidden" />
        </div>
      )}
    </div>
  );
}