"use client";

import Link from "next/link";
import Image from "next/image";
import { CalendarDays, ArrowRight } from "lucide-react";
import type { PublicPost } from "@/lib/actions/public-blog";
import type { Lang } from "@/lib/data";

type Props = {
  post: PublicPost;
  lang: Lang;
};

export function BlogCard({ post, lang }: Props) {
  // Форматирование даты
  const date = new Date(post.published_at).toLocaleDateString(
    lang === "ru" ? "ru-RU" : "az-AZ", 
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
    <Link 
      href={`/${lang}/blog/${post.slug}`}
      className="group flex flex-col bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 h-full"
    >
      {/* Изображение */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300 font-bold">
            MD BAKU
          </div>
        )}
        {/* Оверлей даты */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold text-slate-900 flex items-center gap-2 shadow-sm">
            <CalendarDays size={14} className="text-amber-600" />
            {date}
        </div>
      </div>

      {/* Контент */}
      <div className="flex-1 p-6 md:p-8 flex flex-col">
        <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-amber-600 transition-colors">
          {post.title}
        </h3>
        
        {post.excerpt && (
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center text-sm font-bold text-amber-600 group-hover:translate-x-1 transition-transform">
           {lang === 'ru' ? 'Читать далее' : 'Daha ətraflı'} 
           <ArrowRight size={16} className="ml-2" />
        </div>
      </div>
    </Link>
  );
}