"use client";

import Link from "next/link";
import { Phone, MapPin, Facebook, Instagram, Youtube, ChevronRight, ShieldCheck } from "lucide-react";

/* eslint-disable @next/next/no-img-element */

// TikTok ikonu üçün xüsusi komponent (lucide-react-da olmaya bilər)
const TiktokIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

type FooterT = {
  footer: {
    contact: string;
    links: string;
    info: string;
    social: string;
    rights: string;
    privacyPolicy: string;
    
    // Массивы названий ссылок (берутся из lib/data.ts)
    quickLinks: readonly string[]; 
    infoLinks: readonly string[];

    fullAddress: string;
  };
};

type Props = {
  t: FooterT;
  lang: string;
};

export default function Footer({ t, lang }: Props) {
  
  // 1. Пути для первой колонки "Ссылки"
  const quickRoutes = ["", "products", "blog", "about", "contacts"];

  // 2. Пути для второй колонки "Инфо"
  const infoRoutes = ["terms"];

  return (
    <footer className="bg-[#111] text-white pt-16 md:pt-24 pb-10 text-sm border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
        
        {/* КОНТАКТЫ */}
        <div>
          <h4 className="font-bold text-white uppercase tracking-wider mb-6 border-b border-gray-700 pb-3 inline-block text-xs md:text-sm">
            {t.footer.contact}
          </h4>
          <ul className="space-y-5 text-gray-400">
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center text-amber-500 shrink-0">
                <Phone size={16} />
              </div>
              <div className="flex flex-col text-xs md:text-sm gap-1">
                <a href="tel:+994552677811" className="hover:text-white transition font-bold text-white">
                  (+994 55) 267 78 11
                </a>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center text-amber-500 shrink-0">
                <MapPin size={16} />
              </div>
              <span className="text-xs md:text-sm leading-relaxed text-gray-400">{t.footer.fullAddress}</span>
            </li>
          </ul>
        </div>

        {/* ССЫЛКИ 1 (ОСНОВНАЯ НАВИГАЦИЯ) */}
        <div className="hidden md:block">
          <h4 className="font-bold text-white uppercase tracking-wider mb-6 border-b border-gray-700 pb-3 inline-block">
            {t.footer.links}
          </h4>
          <ul className="space-y-3 text-gray-400 text-xs md:text-sm">
            {t.footer.quickLinks.map((label, i) => {
              const path = quickRoutes[i] !== undefined ? `/${lang}/${quickRoutes[i]}` : '#';
              const href = path.replace(/\/$/, "") || "/";

              return (
                <li key={i}>
                  <Link href={href} className="hover:text-amber-500 transition flex items-center gap-2 group">
                    <ChevronRight size={12} className="group-hover:translate-x-1 transition" /> 
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ССЫЛКИ 2 (ИНФО / УСЛОВИЯ) */}
        <div className="hidden md:block">
          <h4 className="font-bold text-white uppercase tracking-wider mb-6 border-b border-gray-700 pb-3 inline-block">
            {t.footer.info}
          </h4>
          <ul className="space-y-3 text-gray-400 text-xs md:text-sm">
            {t.footer.infoLinks.map((label, i) => {
               const path = infoRoutes[i] !== undefined ? `/${lang}/${infoRoutes[i]}` : '#';
               
               return (
                <li key={i}>
                  <Link href={path} className="hover:text-amber-500 transition flex items-center gap-2 group">
                    <ChevronRight size={12} className="group-hover:translate-x-1 transition" /> 
                    {label}
                  </Link>
                </li>
               );
            })}
          </ul>
        </div>

        {/* СОЦСЕТИ И БРЕНД */}
        <div>
          <h4 className="font-bold text-white uppercase tracking-wider mb-6 border-b border-gray-700 pb-3 inline-block text-xs md:text-sm">
            {t.footer.social}
          </h4>

          <div className="flex gap-3 mb-8 flex-wrap">
            {/* Facebook */}
            <a
              href="https://www.facebook.com/people/DetektorBaku/61582712875786/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-gray-800 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition rounded-lg text-gray-400 hover:-translate-y-1"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/detektorbaku"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-gray-800 flex items-center justify-center hover:bg-[#E4405F] hover:text-white transition rounded-lg text-gray-400 hover:-translate-y-1"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>

            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@detektorbaku"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-gray-800 flex items-center justify-center hover:bg-[#000000] hover:text-white transition rounded-lg text-gray-400 hover:-translate-y-1"
              aria-label="TikTok"
            >
              <TiktokIcon size={20} />
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/@detektorbaku"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-gray-800 flex items-center justify-center hover:bg-[#FF0000] hover:text-white transition rounded-lg text-gray-400 hover:-translate-y-1"
              aria-label="YouTube"
            >
              <Youtube size={20} />
            </a>
          </div>

          <div className="text-3xl font-black text-white tracking-tighter">
            MD <span className="text-amber-600">BAKU</span>
          </div>
          <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest font-bold">
            Official Distributor &amp; Service
          </p>
        </div>
      </div>

      {/* НИЖНЯЯ ПАНЕЛЬ */}
      <div className="border-t border-gray-800 pt-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          
          <div className="text-[10px] md:text-xs text-gray-600 font-medium text-center md:text-left">
            <p>&copy; 2026 MD Baku. {t.footer.rights}</p>
          </div>

          <Link 
            href={`/${lang}/privacy`} 
            className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-gray-500 hover:text-amber-500 transition-colors uppercase tracking-wider"
          >
            <ShieldCheck size={14} />
            {t.footer.privacyPolicy || "Privacy Policy"}
          </Link>

        </div>
      </div>
    </footer>
  );
}