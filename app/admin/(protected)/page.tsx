"use client";

import Link from "next/link";
import { Package, PenTool, ArrowRight, Plus } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 sm:py-16 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
      {/* Заголовок страницы */}
      <div className="space-y-1">
        <h2 className="text-3xl font-bold text-slate-900">
          Панель управления
        </h2>
        <p className="text-slate-500 max-w-lg">
          Выберите раздел для редактирования контента.
        </p>
      </div>

      {/* Сетка модулей */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* --- КАРТОЧКА: ТОВАРЫ --- */}
        <Link 
          href="/admin/products"
          className="group relative flex flex-col justify-between h-64 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm active:scale-[0.98] transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-amber-900/5 hover:border-amber-200 hover:-translate-y-1"
        >
          {/* Декор фона (Только на ПК при ховере) */}
          <div className="hidden sm:block absolute top-0 right-0 w-48 h-48 bg-amber-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-10 -translate-y-10" />

          <div className="relative z-10 flex justify-between items-start">
            <div className="w-14 h-14 bg-amber-50 sm:bg-slate-50 rounded-2xl flex items-center justify-center text-amber-700 sm:text-slate-900 sm:group-hover:bg-amber-600 sm:group-hover:text-white transition-colors duration-300">
              <Package size={28} strokeWidth={1.5} />
            </div>
            
            {/* Стрелка: На мобильном прямая и цветная, на ПК поворачивается */}
            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-amber-100 sm:border-slate-100 text-amber-600 sm:text-slate-300 sm:group-hover:border-amber-200 sm:group-hover:text-amber-600 transition-colors">
              <ArrowRight size={16} className="rotate-0 sm:-rotate-45 sm:group-hover:rotate-0 transition-transform duration-300" />
            </div>
          </div>

          <div className="relative z-10 space-y-1">
            <h3 className="text-2xl font-bold text-slate-900 sm:group-hover:text-amber-700 transition-colors">
              Товары
            </h3>
            <p className="text-sm text-slate-500 font-medium sm:group-hover:text-slate-600">
              Каталог продукции, цены и наличие.
            </p>
          </div>

          {/* Кнопка действия: Видна всегда на мобильном, выезжает на ПК */}
          <div className="relative z-10 mt-auto pt-4 flex items-center gap-2 text-xs font-bold text-amber-600 transition-all duration-300 
            opacity-100 translate-y-0 
            sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0"
          >
            <Plus size={14} />
            <span>Добавить товар</span>
          </div>
        </Link>

        {/* --- КАРТОЧКА: БЛОГ --- */}
        <Link 
          href="/admin/blog"
          className="group relative flex flex-col justify-between h-64 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm active:scale-[0.98] transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-200 hover:-translate-y-1"
        >
          {/* Декор фона */}
          <div className="hidden sm:block absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-10 -translate-y-10" />

          <div className="relative z-10 flex justify-between items-start">
            <div className="w-14 h-14 bg-blue-50 sm:bg-slate-50 rounded-2xl flex items-center justify-center text-blue-700 sm:text-slate-900 sm:group-hover:bg-blue-600 sm:group-hover:text-white transition-colors duration-300">
              <PenTool size={28} strokeWidth={1.5} />
            </div>
            
            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-blue-100 sm:border-slate-100 text-blue-600 sm:text-slate-300 sm:group-hover:border-blue-200 sm:group-hover:text-blue-600 transition-colors">
              <ArrowRight size={16} className="rotate-0 sm:-rotate-45 sm:group-hover:rotate-0 transition-transform duration-300" />
            </div>
          </div>

          <div className="relative z-10 space-y-1">
            <h3 className="text-2xl font-bold text-slate-900 sm:group-hover:text-blue-700 transition-colors">
              Блог
            </h3>
            <p className="text-sm text-slate-500 font-medium sm:group-hover:text-slate-600">
              Статьи, новости и публикации.
            </p>
          </div>

          <div className="relative z-10 mt-auto pt-4 flex items-center gap-2 text-xs font-bold text-blue-600 transition-all duration-300
            opacity-100 translate-y-0 
            sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0"
          >
            <Plus size={14} />
            <span>Написать статью</span>
          </div>
        </Link>

      </div>
    </div>
  );
}