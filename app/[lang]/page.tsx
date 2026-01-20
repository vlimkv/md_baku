"use client";

import { useEffect, useState } from "react";
import {
  Heart,
  Star,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  Play,
  ShieldCheck,
  Truck,
  CreditCard,
  Award,
  Search,
} from "lucide-react";

import { useLang } from "@/components/layout/LangProvider";

/* eslint-disable @next/next/no-img-element */

type Product = { id: number; title: string; price: string; image: string; badge?: string };
type MiniItem = { title: string; price: string; image: string };

type WhyKey = "warranty" | "original" | "shipping" | "installments";
type VideoItem = { id: number; title: string; img: string };

// --- 1. КАРТОЧКА ТОВАРА (С ЖИВОЙ КНОПКОЙ WA) ---
function ProductCard({
  title,
  price,
  image,
  badge,
  freeShippingLabel,
  orderBtn,
  waText,
}: Product & { freeShippingLabel: string; orderBtn: string; waText: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] transition-all duration-500 group h-full flex flex-col relative">
      <div className="relative aspect-square bg-gray-50 p-4">
        <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[9px] font-bold px-2 py-1 uppercase z-10 rounded-md shadow-lg shadow-emerald-600/20">
          {freeShippingLabel}
        </span>

        {badge ? (
          <span className="absolute top-10 left-3 bg-rose-600 text-white text-[9px] font-bold px-2 py-1 uppercase rounded-md shadow-lg shadow-rose-600/20">
            {badge}
          </span>
        ) : null}

        <img
          src={image}
          alt={title}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 mix-blend-multiply"
        />

        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
          <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md text-gray-400 hover:text-red-500 transition">
            <Heart size={16} />
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 bg-white relative z-20">
        <div className="flex gap-0.5 text-amber-400 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={10} fill="currentColor" />
          ))}
        </div>

        <h3 className="text-xs font-bold text-gray-900 mb-2 line-clamp-2 min-h-[32px] leading-relaxed group-hover:text-amber-600 transition-colors">
          {title}
        </h3>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          <span className="text-sm font-black text-gray-900">{price} ₼</span>

          <a
            href={`https://wa.me/994552677811?text=${encodeURIComponent(`${waText} ${title}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1.5 rounded-full hover:shadow-lg hover:shadow-emerald-500/40 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 group/btn"
          >
            <span className="text-[10px] font-bold uppercase tracking-wide hidden md:block">{orderBtn}</span>
            <MessageCircle
              size={14}
              className="animate-pulse md:animate-none group-hover/btn:rotate-12 transition-transform"
            />
          </a>
        </div>
      </div>
    </div>
  );
}

function MiniProduct({ title, price, image }: MiniItem) {
  return (
    <div className="flex gap-4 p-3 hover:bg-gray-50 transition border-b border-gray-50 last:border-0 items-center group cursor-pointer rounded-lg">
      <div className="w-16 h-16 bg-white border border-gray-100 rounded-lg p-1 flex items-center justify-center group-hover:border-amber-400 transition-colors">
        <img src={image} className="w-full h-full object-contain" alt={title} />
      </div>
      <div className="flex-1">
        <h4 className="text-xs font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-amber-600 transition">
          {title}
        </h4>
        <div className="flex gap-0.5 text-amber-400 mb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={8} fill="currentColor" />
          ))}
        </div>
        <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-gray-600">
          {price} ₼
        </span>
      </div>
    </div>
  );
}

function VideoSection({ title, videos }: { title: string; videos: readonly VideoItem[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-16 relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
          <Play size={20} fill="currentColor" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {videos.map((v) => (
          <div
            key={v.id}
            className="group relative rounded-xl overflow-hidden cursor-pointer h-56 shadow-md hover:shadow-2xl hover:shadow-rose-900/20 transition-all duration-500"
          >
            <img
              src={v.img}
              alt={v.title}
              className="w-full h-full object-cover transition duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/30 rounded-full animate-ping opacity-75"></div>
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md border border-white/60 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <Play size={24} className="text-white fill-white ml-1" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 pt-12">
              <h3 className="text-white font-bold text-sm tracking-wide translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                {v.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WhyUsSection({
  title,
  items,
}: {
  title: string;
  items: readonly { key: WhyKey; title: string; desc: string }[];
}) {
  const iconByKey: Record<WhyKey, any> = {
    warranty: ShieldCheck,
    original: Award,
    shipping: Truck,
    installments: CreditCard,
  };

  return (
    <div className="relative bg-[#0F1115] text-white py-16 rounded-2xl mb-16 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[80px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">{title}</h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((item, idx) => {
            const Icon = iconByKey[item.key];
            return (
              <div key={idx} className="group flex flex-col items-center text-center cursor-default">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-amber-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-700"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-2xl group-hover:-translate-y-2 transition-all duration-500 ease-out group-hover:border-amber-500/50">
                    <Icon size={32} className="text-gray-400 group-hover:text-amber-400 transition-colors duration-500" strokeWidth={1.5} />
                  </div>
                </div>

                <h4 className="font-bold uppercase text-sm mb-3 tracking-wider group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-400 max-w-[180px] leading-relaxed group-hover:text-gray-300 transition-colors">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const { t } = useLang();
  const heroSlides = t.heroSlides;

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setCurrentSlide(0);
  }, [t]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));

  // --- DEMO DATA ---
  const products: Product[] = [
    { id: 1, title: "Nokta Simplex Ultra Professional Detector", price: "850.00", image: "https://via.placeholder.com/400x400?text=Simplex", badge: "HIT" },
    { id: 2, title: "Minelab Equinox 900 Multi-IQ Technology", price: "2150.00", image: "https://via.placeholder.com/400x400?text=Equinox", badge: "PRO" },
    { id: 3, title: "XP Deus II FMF Full Set with WS6", price: "2800.00", image: "https://via.placeholder.com/400x400?text=DeusII", badge: "NEW" },
    { id: 4, title: "Garrett AT Max International", price: "1450.00", image: "https://via.placeholder.com/400x400?text=Garrett" },
    { id: 5, title: "Nokta Legend WHP Pack", price: "1650.00", image: "https://via.placeholder.com/400x400?text=Legend", badge: "BEST" },
    { id: 6, title: "Minelab Manticore High Power", price: "3200.00", image: "https://via.placeholder.com/400x400?text=Manticore", badge: "TOP" },
  ];

  const deals: Product[] = [
    { id: 11, title: "PulseDive Pointer Waterproof", price: "350.00", image: "https://via.placeholder.com/400x400?text=PulseDive", badge: "DEAL" },
    { id: 12, title: "Nokta Legend Bundle Special", price: "1650.00", image: "https://via.placeholder.com/400x400?text=Bundle", badge: "SALE" },
    { id: 13, title: "Minelab Vanquish 540 Pro", price: "690.00", image: "https://via.placeholder.com/400x400?text=Vanquish", badge: "PROMO" },
    { id: 14, title: "XP MI-6 Pinpointer Wireless", price: "320.00", image: "https://via.placeholder.com/400x400?text=Pinpointer" },
    { id: 15, title: "Quest X10 Pro Waterproof", price: "450.00", image: "https://via.placeholder.com/400x400?text=Quest" },
    { id: 16, title: "Gold Cruzzer 61kHz High Freq", price: "1200.00", image: "https://via.placeholder.com/400x400?text=Cruzzer", badge: "-15%" },
  ];

  const miniNew: MiniItem[] = [
    { title: "XP Deus II FMF WS6 Master", price: "2800.00", image: "https://via.placeholder.com/150x150?text=XP" },
    { title: "Minelab X-Terra Pro", price: "990.00", image: "https://via.placeholder.com/150x150?text=XTerra" },
    { title: "Nokta AccuPoint", price: "320.00", image: "https://via.placeholder.com/150x150?text=AccuPoint" },
  ];

  return (
    <>
      {/* --- HERO SLIDER --- */}
      <section className="relative w-full h-[240px] md:h-[550px] bg-gray-900 overflow-hidden group">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] scale-105"
              style={{
                backgroundImage: `url('${slide.image}')`,
                transform: index === currentSlide ? "scale(1.1)" : "scale(1)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-900/40 to-transparent"></div>
            </div>

            <div className="relative z-20 max-w-7xl mx-auto px-4 h-full flex items-center">
              <div
                className="max-w-2xl mt-2 md:mt-0 opacity-0 animate-fade-in-up"
                style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
              >
                <span className="inline-block px-3 py-1 bg-amber-500/20 border border-amber-500 text-amber-400 text-[9px] md:text-xs font-bold uppercase tracking-widest mb-3 md:mb-6 rounded backdrop-blur-md">
                  {slide.badge}
                </span>
                <h2 className="text-2xl md:text-6xl font-black text-white mb-3 md:mb-6 leading-[1.1] tracking-tight drop-shadow-lg">
                  {slide.title}
                </h2>
                <p className="text-xs md:text-lg text-gray-300 mb-5 md:mb-10 border-l-[3px] md:border-l-4 border-amber-600 pl-4 md:pl-6 line-clamp-2 md:line-clamp-none max-w-lg font-light">
                  {slide.desc}
                </p>
                <button className="bg-amber-600 text-white px-6 py-3 md:px-10 md:py-4 font-bold uppercase text-[10px] md:text-sm hover:bg-amber-500 transition-all flex items-center gap-3 rounded-lg shadow-lg shadow-amber-600/30 hover:shadow-amber-600/50 hover:-translate-y-1">
                  {slide.btn} <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-14 md:h-14 bg-white/5 hover:bg-amber-600 text-white flex items-center justify-center rounded-full backdrop-blur-md border border-white/10 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-14 md:h-14 bg-white/5 hover:bg-amber-600 text-white flex items-center justify-center rounded-full backdrop-blur-md border border-white/10 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
        >
          <ChevronRight size={24} />
        </button>
      </section>

      {/* --- CATEGORIES STRIP --- */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 md:-mt-14 mb-10 md:mb-20 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {t.categories.items.map((cat, i) => (
            <div
              key={i}
              className="bg-white p-4 md:p-6 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col md:flex-row items-center gap-3 md:gap-5 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group text-center md:text-left h-full justify-center md:justify-start"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-amber-600 transition-all duration-300 shrink-0 group-hover:scale-110 shadow-inner">
                <Search size={20} className="md:w-8 md:h-8 text-gray-400 group-hover:text-white transition" />
              </div>
              <h3 className="font-bold text-[10px] md:text-sm text-gray-800 group-hover:text-amber-600 transition leading-tight uppercase tracking-wide">
                {cat}
              </h3>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-12 md:space-y-20 pb-12 md:pb-24">
        {/* --- BEST SELLERS --- */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-8">
          <div className="flex justify-between items-end mb-6 md:mb-10 border-b border-gray-100 pb-5">
            <div>
              <h2 className="text-lg md:text-3xl font-black text-gray-900 uppercase tracking-tight">
                {t.sections.best.title}
              </h2>
              <div className="h-1.5 w-12 md:w-20 bg-amber-500 rounded-full mt-2"></div>
            </div>
            <button className="text-[10px] md:text-sm font-bold text-gray-400 hover:text-amber-600 transition uppercase flex items-center gap-1 group">
              {t.sections.best.cta}{" "}
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-8">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                {...p}
                freeShippingLabel={t.productCard.freeShipping}
                orderBtn={t.productCard.orderBtn}
                waText={t.productCard.waText}
              />
            ))}
          </div>
        </div>

        {/* --- DEALS --- */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-8">
          <div className="flex justify-between items-end mb-6 md:mb-10 border-b border-gray-100 pb-5">
            <div>
              <h2 className="text-lg md:text-3xl font-black text-gray-900 uppercase tracking-tight">
                {t.sections.deals.title}
              </h2>
              <div className="h-1.5 w-12 md:w-20 bg-amber-500 rounded-full mt-2"></div>
            </div>
            <button className="text-[10px] md:text-sm font-bold text-gray-400 hover:text-amber-600 transition uppercase flex items-center gap-1 group">
              {t.sections.deals.cta}{" "}
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-8">
            {deals.map((p) => (
              <ProductCard
                key={p.id}
                {...p}
                freeShippingLabel={t.productCard.freeShipping}
                orderBtn={t.productCard.orderBtn}
                waText={t.productCard.waText}
              />
            ))}
          </div>
        </div>

        <VideoSection title={t.videoSection.title} videos={t.videoSection.videos} />
        <WhyUsSection title={t.whyUs.title} items={t.whyUs.items} />

        {/* --- 3 COLUMNS WIDGETS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {[
            { title: t.sections.columns.new, items: miniNew },
            { title: t.sections.columns.top, items: miniNew },
            { title: t.sections.columns.rec, items: miniNew },
          ].map((col, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 hover:shadow-xl transition-shadow duration-500"
            >
              <h3 className="text-base md:text-xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-4">
                {col.title}
              </h3>
              <div className="space-y-2">{col.items.map((p, i) => <MiniProduct key={i} {...p} />)}</div>
            </div>
          ))}
        </div>

        {/* --- BRANDS --- */}
        <div className="bg-white border border-gray-100 py-10 md:py-16 text-center rounded-2xl shadow-sm">
          <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-8 md:mb-12">
            {t.brands.label}
          </p>
          <div className="flex flex-wrap justify-center gap-10 md:gap-20 opacity-40 hover:opacity-100 transition-opacity duration-700">
            {t.brands.names.map((b) => (
              <h2
                key={b}
                className="text-2xl md:text-4xl font-black text-gray-800 cursor-default tracking-tighter hover:text-amber-600 transition-colors"
              >
                {b}
              </h2>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}