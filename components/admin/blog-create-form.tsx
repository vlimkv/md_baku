"use client";

import { useState } from "react";
import { adminCreatePost } from "@/lib/actions/blog";
import { Plus, Minus, PenTool, ChevronDown } from "lucide-react";
import { SaveBtn } from "@/components/admin/submit-buttons";

export function BlogCreateForm() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`bg-white border transition-all duration-300 overflow-hidden ${isOpen ? 'rounded-3xl border-blue-200 shadow-xl' : 'rounded-2xl border-dashed border-slate-300 hover:border-blue-300 hover:bg-blue-50/10'}`}>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 cursor-pointer outline-none group"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isOpen ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
             {isOpen ? <Minus size={18} /> : <PenTool size={18} />}
          </div>
          <div className="text-left">
            <h2 className={`text-sm font-bold uppercase tracking-wide transition-colors ${isOpen ? 'text-slate-900' : 'text-slate-500 group-hover:text-blue-700'}`}>
              {isOpen ? "Новая статья" : "Написать статью"}
            </h2>
          </div>
        </div>
        
        <ChevronDown size={20} className={`text-slate-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="animate-in slide-in-from-top-2 duration-300 border-t border-slate-100 bg-slate-50/30">
          <form action={async (fd) => {
              await adminCreatePost(fd);
              setIsOpen(false);
          }} className="p-5 sm:p-6">
             
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Заголовок (RU) *</label>
                   <input name="title_ru" required placeholder="Обзор Minelab..." className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Заголовок (AZ)</label>
                   <input name="title_az" placeholder="Minelab icmalı..." className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Slug</label>
                   <input name="slug" placeholder="auto" className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                </div>
                <div className="w-full">
                   <SaveBtn label="Создать черновик" />
                </div>
             </div>
          </form>
        </div>
      )}
    </div>
  );
}