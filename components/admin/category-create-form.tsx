"use client";

import { useState } from "react";
import { adminCreateCategory } from "@/lib/actions/categories";
import { Plus, Minus, FolderPlus, ChevronDown } from "lucide-react";
import { SaveBtn } from "@/components/admin/submit-buttons";

export function CategoryCreateForm() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`bg-white border transition-all duration-300 overflow-hidden mt-6 ${isOpen ? 'rounded-3xl border-indigo-200 shadow-xl' : 'rounded-2xl border-dashed border-slate-300 hover:border-indigo-300 hover:bg-indigo-50/10'}`}>
      
      {/* HEADER Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 cursor-pointer outline-none group"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isOpen ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
             {isOpen ? <Minus size={18} /> : <FolderPlus size={18} />}
          </div>
          <div className="text-left">
            <h2 className={`text-sm font-bold uppercase tracking-wide transition-colors ${isOpen ? 'text-slate-900' : 'text-slate-500 group-hover:text-indigo-700'}`}>
              {isOpen ? "Новая категория" : "Создать категорию"}
            </h2>
          </div>
        </div>
        
        <ChevronDown size={20} className={`text-slate-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* FORM */}
      {isOpen && (
        <div className="animate-in slide-in-from-top-2 duration-300 border-t border-slate-100 bg-slate-50/30">
          <form action={async (fd) => {
              await adminCreateCategory(fd);
              setIsOpen(false); // Закрываем форму после успеха
          }} className="p-5 sm:p-6">
             
             {/* GRID LAYOUT:
                - grid-cols-1: Мобилка (все в столбик)
                - sm:grid-cols-2: Планшет (2 ряда по 2 элемента)
                - lg:grid-cols-4: ПК (все в одну линию)
                - items-end: Выравнивание по нижнему краю (чтобы кнопка была вровень с инпутами)
             */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Название (RU) *</label>
                   <input name="title_ru" required placeholder="Например: Катушки" className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" />
                </div>
                
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Название (AZ)</label>
                   <input name="title_az" placeholder="Məsələn: Bobinlər" className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" />
                </div>

                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Slug</label>
                   <input name="slug" required placeholder="coils" className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" />
                </div>

                {/* Кнопка занимает всю ширину своей колонки */}
                <div className="w-full">
                   <SaveBtn label="Создать" />
                </div>

             </div>
          </form>
        </div>
      )}
    </div>
  );
}