"use client";

import { useState } from "react";
import { adminCreateProduct } from "@/lib/actions/products";
import { Plus, Minus, Info, Tag, AlertCircle, DollarSign, Activity, Layers, ChevronDown } from "lucide-react";
import { SaveBtn } from "@/components/admin/submit-buttons";

type Collection = { id: number; key: string; title_ru: string; };
type Category = { id: number; slug: string; title_ru?: string }; // Тип для категорий

export function ProductCreateForm({ 
  collections, 
  categories 
}: { 
  collections: Collection[], 
  categories: Category[] 
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`bg-white border transition-all duration-300 overflow-hidden ${isOpen ? 'rounded-3xl border-slate-200 shadow-xl' : 'rounded-2xl border-dashed border-slate-300 hover:border-amber-400 hover:bg-amber-50/10'}`}>
      
      {/* HEADER */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 cursor-pointer outline-none group"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isOpen ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500 group-hover:bg-amber-100 group-hover:text-amber-600'}`}>
             {isOpen ? <Minus size={18} /> : <Plus size={18} />}
          </div>
          <div className="text-left">
            <h2 className={`text-sm font-bold uppercase tracking-wide transition-colors ${isOpen ? 'text-slate-900' : 'text-slate-500 group-hover:text-amber-700'}`}>
              {isOpen ? "Новый товар" : "Быстрое добавление товара"}
            </h2>
          </div>
        </div>
        <ChevronDown size={20} className={`text-slate-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* FORM BODY */}
      {isOpen && (
        <div className="animate-in slide-in-from-top-2 duration-300 border-t border-slate-100">
          <form action={adminCreateProduct} className="p-5 sm:p-8">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                
                {/* --- LEFT SIDE --- */}
                <div className="lg:col-span-7 space-y-5">
                    
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Название (RU) *</label>
                        <input name="title_ru" required placeholder="Minelab Equinox 900" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-amber-500 outline-none transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Название (AZ)</label>
                        <input name="title_az" placeholder="Metal aşkarlayıcı..." className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-amber-500 outline-none transition-all" />
                      </div>
                    </div>

                    {/* Slug & Badge & CATEGORY */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Категория</label>
                        <div className="relative">
                            <select name="category_id" className="w-full h-11 pl-4 pr-8 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:border-amber-500 outline-none appearance-none cursor-pointer">
                                <option value="">-- Выбрать --</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.title_ru || c.slug}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Slug</label>
                        <input name="slug" placeholder="auto" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:border-amber-500 outline-none transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Badge</label>
                        <input name="badge" placeholder="HIT" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-amber-500 outline-none transition-all" />
                      </div>
                    </div>
                </div>

                {/* --- RIGHT SIDE --- */}
                <div className="lg:col-span-5 space-y-5 flex flex-col h-full">
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Цена</label>
                        <input type="number" name="price" step="0.01" required placeholder="0.00" className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:border-emerald-500 outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Старая</label>
                        <input type="number" name="old_price" step="0.01" placeholder="0.00" className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-slate-400 line-through focus:border-slate-400 outline-none" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                       <label className="flex items-center justify-center gap-2 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 transition-all active:scale-95">
                          <input type="checkbox" name="is_active" defaultChecked className="w-4 h-4 accent-emerald-600 hidden peer" />
                          <div className="w-3 h-3 rounded-full bg-slate-300 peer-checked:bg-emerald-500"></div>
                          <span className="text-xs font-bold text-slate-600 peer-checked:text-emerald-700 select-none">Активен</span>
                       </label>
                       <label className="flex items-center justify-center gap-2 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 transition-all active:scale-95">
                          <input type="checkbox" name="in_stock" defaultChecked className="w-4 h-4 accent-blue-600 hidden peer" />
                          <div className="w-3 h-3 rounded-full bg-slate-300 peer-checked:bg-blue-500"></div>
                          <span className="text-xs font-bold text-slate-600 peer-checked:text-blue-700 select-none">Наличие</span>
                       </label>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-2xl p-4 border border-indigo-100 flex-1">
                    <div className="flex flex-wrap gap-2">
                      {collections.map((col) => (
                        <label key={col.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 rounded-lg border border-indigo-100 cursor-pointer hover:bg-white transition-all active:scale-95 has-[:checked]:bg-indigo-600 has-[:checked]:text-white has-[:checked]:border-indigo-600">
                          <input type="checkbox" name={`collection_${col.key}`} className="hidden" />
                          <span className="text-[10px] font-bold select-none">{col.title_ru}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <SaveBtn label="Создать товар" />
                </div>
             </div>
          </form>
        </div>
      )}
    </div>
  );
}