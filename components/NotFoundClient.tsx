import Link from "next/link";
import { Search, Home, ChevronRight, AlertCircle, Radar } from "lucide-react";
import type { Lang } from "@/lib/data";
import { siteContent } from "@/lib/data";

type T = (typeof siteContent)[Lang]["notFound"];

export default function NotFoundView({ lang, t }: { lang: Lang; t: T }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F8F9FA] px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center">
        <div className="relative w-32 h-32 mx-auto mb-8 flex items-center justify-center">
          <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping opacity-75 duration-[2000ms]" />
          <div className="absolute inset-2 bg-amber-500/10 rounded-full animate-ping opacity-50 duration-[2000ms] delay-150" />

          <div className="relative w-24 h-24 bg-white rounded-full border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] flex items-center justify-center z-10">
            <Radar size={48} className="text-amber-600 animate-pulse" strokeWidth={1.5} />
          </div>

          <div className="absolute -top-2 -right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white z-20">
            <AlertCircle size={16} />
          </div>
        </div>

        <h1 className="text-8xl font-black text-gray-900 tracking-tighter mb-2 leading-none">
          4<span className="text-amber-500 inline-block animate-pulse">0</span>4
        </h1>

        <h2 className="text-xl md:text-2xl font-bold text-gray-800 uppercase tracking-wide mb-4">
          {t.title}
        </h2>

        <p className="text-sm text-gray-500 mb-10 leading-relaxed max-w-xs mx-auto">
          {t.desc}
        </p>

        <div className="bg-white p-2 rounded-full shadow-lg border border-gray-100 flex items-center mb-8 max-w-sm mx-auto">
          <input
            type="text"
            placeholder={t.placeholder}
            className="flex-1 bg-transparent border-none outline-none text-sm px-4 text-gray-700 placeholder:text-gray-400 h-10"
          />
          <button className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors shadow-md">
            <Search size={18} />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={`/${lang}`}
            className="w-full sm:w-auto bg-amber-600 text-white px-8 py-3.5 rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-amber-500 transition-all shadow-lg shadow-amber-600/20 hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            <Home size={16} />
            {t.home}
          </Link>

          <Link
            href={`/${lang}/catalog`}
            className="w-full sm:w-auto bg-white text-gray-900 border border-gray-200 px-8 py-3.5 rounded-xl font-bold uppercase text-xs tracking-wider hover:border-amber-500 hover:text-amber-600 transition-all hover:shadow-lg flex items-center justify-center gap-2 group"
          >
            {t.catalog}
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}