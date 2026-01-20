"use client";

import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, ChevronRight } from "lucide-react";

/* eslint-disable @next/next/no-img-element */

type FooterT = {
  footer: {
    contact: string;
    links: string;
    info: string;
    social: string;
    rights: string;

    // ✅ главное: readonly
    quickLinks: readonly string[];
    infoLinks: readonly string[];

    fullAddress: string;
  };
};

type Props = {
  t: FooterT;
};

export default function Footer({ t }: Props) {
  return (
    <footer className="bg-[#111] text-white pt-16 md:pt-24 pb-10 text-sm border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
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
                <a href="tel:+994509785682" className="hover:text-white transition">
                  (+994 50) 978 56 82
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

        <div className="hidden md:block">
          <h4 className="font-bold text-white uppercase tracking-wider mb-6 border-b border-gray-700 pb-3 inline-block">
            {t.footer.links}
          </h4>
          <ul className="space-y-3 text-gray-400 text-xs md:text-sm">
            {t.footer.quickLinks.map((x) => (
              <li key={x}>
                <a href="#" className="hover:text-amber-500 transition flex items-center gap-2 group">
                  <ChevronRight size={12} className="group-hover:translate-x-1 transition" /> {x}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden md:block">
          <h4 className="font-bold text-white uppercase tracking-wider mb-6 border-b border-gray-700 pb-3 inline-block">
            {t.footer.info}
          </h4>
          <ul className="space-y-3 text-gray-400 text-xs md:text-sm">
            {t.footer.infoLinks.map((x) => (
              <li key={x}>
                <a href="#" className="hover:text-amber-500 transition flex items-center gap-2 group">
                  <ChevronRight size={12} className="group-hover:translate-x-1 transition" /> {x}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white uppercase tracking-wider mb-6 border-b border-gray-700 pb-3 inline-block text-xs md:text-sm">
            {t.footer.social}
          </h4>

          <div className="flex gap-3 mb-8">
            <a
              href="#"
              className="w-10 h-10 bg-gray-800 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition rounded-lg text-gray-400 hover:-translate-y-1"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-gray-800 flex items-center justify-center hover:bg-[#E4405F] hover:text-white transition rounded-lg text-gray-400 hover:-translate-y-1"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-gray-800 flex items-center justify-center hover:bg-[#FF0000] hover:text-white transition rounded-lg text-gray-400 hover:-translate-y-1"
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

      <div className="border-t border-gray-800 pt-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs text-gray-600 text-center md:text-left gap-3 md:gap-0 font-medium">
          <p>&copy; 2026 MD Baku. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}