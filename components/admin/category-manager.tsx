"use client";

import { useState } from "react";
import { AdminCategoryRow, adminDeleteCategory, adminUpdateCategory } from "@/lib/actions/categories";
import { Pencil, Trash2, Save, X, FolderCog, ChevronDown, Globe, Loader2 } from "lucide-react";

export function CategoryManager({ categories }: { categories: AdminCategoryRow[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Храним ID удаляемой категории, чтобы показывать спиннер только на ней
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    // Включаем загрузку
    setDeletingId(id);
    try {
      await adminDeleteCategory(id);
    } catch (e) {
      console.error(e);
    } finally {
      // Выключаем загрузку (хотя строка уже исчезнет, но для безопасности)
      setDeletingId(null);
    }
  };

  return (
    <div className={`bg-white border transition-all duration-300 overflow-hidden mt-4 ${isOpen ? 'rounded-3xl border-slate-300 shadow-xl' : 'rounded-2xl border-dashed border-slate-300 hover:border-slate-400'}`}>
      
      {/* TOGGLE HEADER */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 sm:px-6 py-4 cursor-pointer outline-none group bg-slate-50/50"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isOpen ? 'bg-slate-200 text-slate-700' : 'bg-slate-100 text-slate-500 group-hover:text-slate-900'}`}>
             <FolderCog size={18} />
          </div>
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-slate-600 group-hover:text-slate-900 text-left">
            Управление категориями ({categories.length})
          </h2>
        </div>
        <ChevronDown size={20} className={`text-slate-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* CONTENT */}
      {isOpen && (
        <div>
          {/* 1. DESKTOP TABLE */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-xs font-bold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 w-16">ID</th>
                  <th className="px-6 py-3">Slug</th>
                  <th className="px-6 py-3">Название (RU)</th>
                  <th className="px-6 py-3">Название (AZ)</th>
                  <th className="px-6 py-3 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <CategoryRowDesktop 
                    key={cat.id} 
                    category={cat} 
                    isEditing={editingId === cat.id}
                    isDeleting={deletingId === cat.id}
                    onEdit={() => setEditingId(cat.id)}
                    onCancel={() => setEditingId(null)}
                    onDelete={() => handleDelete(cat.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* 2. MOBILE LIST */}
          <div className="md:hidden flex flex-col divide-y divide-slate-100">
             {categories.map((cat) => (
               <CategoryRowMobile 
                 key={cat.id} 
                 category={cat} 
                 isEditing={editingId === cat.id}
                 isDeleting={deletingId === cat.id}
                 onEdit={() => setEditingId(cat.id)}
                 onCancel={() => setEditingId(null)}
                 onDelete={() => handleDelete(cat.id)}
               />
             ))}
          </div>

          {categories.length === 0 && (
            <div className="px-6 py-8 text-center text-slate-400 text-sm">
              Категорий пока нет.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- КОМПОНЕНТ ДЛЯ ДЕСКТОПА ---
function CategoryRowDesktop({ 
  category, isEditing, isDeleting, onEdit, onCancel, onDelete 
}: any) {
  const [isSaving, setIsSaving] = useState(false);

  if (isEditing) {
    return (
      <tr className="bg-amber-50/50">
        <td className="px-6 py-3 text-slate-400 font-mono">{category.id}</td>
        <td className="px-6 py-3">
           <input id={`slug-${category.id}`} defaultValue={category.slug} className="w-full bg-white border border-amber-300 rounded px-2 py-1 text-xs font-mono focus:outline-none" />
        </td>
        <td className="px-6 py-3">
           <input id={`ru-${category.id}`} defaultValue={category.title_ru} className="w-full bg-white border border-amber-300 rounded px-2 py-1 text-sm font-bold focus:outline-none" />
        </td>
        <td className="px-6 py-3">
           <input id={`az-${category.id}`} defaultValue={category.title_az} className="w-full bg-white border border-amber-300 rounded px-2 py-1 text-sm focus:outline-none" />
        </td>
        <td className="px-6 py-3 text-right">
          <div className="flex justify-end gap-2">
            <button 
              disabled={isSaving}
              onClick={async () => {
                setIsSaving(true);
                const formData = new FormData();
                formData.append("slug", (document.getElementById(`slug-${category.id}`) as HTMLInputElement).value);
                formData.append("title_ru", (document.getElementById(`ru-${category.id}`) as HTMLInputElement).value);
                formData.append("title_az", (document.getElementById(`az-${category.id}`) as HTMLInputElement).value);
                await adminUpdateCategory(category.id, formData);
                setIsSaving(false);
                onCancel();
              }}
              className="p-1.5 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            </button>
            <button onClick={onCancel} className="p-1.5 bg-slate-200 text-slate-600 rounded hover:bg-slate-300 transition">
              <X size={16} />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className={`transition-colors ${isDeleting ? 'bg-rose-50 opacity-50 pointer-events-none' : 'hover:bg-slate-50'}`}>
      <td className="px-6 py-4 text-slate-400 font-mono text-xs">#{category.id}</td>
      <td className="px-6 py-4 font-mono text-xs text-indigo-600 bg-indigo-50/50 rounded w-max px-2 py-1 m-2 inline-block">{category.slug}</td>
      <td className="px-6 py-4 font-bold text-slate-900">{category.title_ru}</td>
      <td className="px-6 py-4 text-slate-600">{category.title_az || "—"}</td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2">
          <button onClick={onEdit} className="p-1.5 text-slate-400 hover:text-amber-600 transition"><Pencil size={16} /></button>
          <button 
            onClick={onDelete} 
            disabled={isDeleting}
            className="p-1.5 text-slate-400 hover:text-rose-600 transition disabled:text-rose-400"
          >
            {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
          </button>
        </div>
      </td>
    </tr>
  );
}

// --- КОМПОНЕНТ ДЛЯ МОБИЛКИ ---
function CategoryRowMobile({ 
  category, isEditing, isDeleting, onEdit, onCancel, onDelete 
}: any) {
  const [isSaving, setIsSaving] = useState(false);

  if (isEditing) {
    return (
      <div className="p-4 bg-amber-50/50 border-l-4 border-amber-400 flex flex-col gap-3">
        <div className="flex justify-between items-center text-xs text-slate-400 font-mono mb-1">
           <span>ID: {category.id}</span>
           <span>Редактирование</span>
        </div>
        
        <div className="space-y-3">
            <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Slug</label>
                <input id={`slug-m-${category.id}`} defaultValue={category.slug} className="w-full h-10 px-3 bg-white border border-amber-300 rounded-lg text-sm font-mono focus:outline-none" />
            </div>
            <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Название (RU)</label>
                <input id={`ru-m-${category.id}`} defaultValue={category.title_ru} className="w-full h-10 px-3 bg-white border border-amber-300 rounded-lg text-sm font-bold focus:outline-none" />
            </div>
            <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Название (AZ)</label>
                <input id={`az-m-${category.id}`} defaultValue={category.title_az} className="w-full h-10 px-3 bg-white border border-amber-300 rounded-lg text-sm focus:outline-none" />
            </div>
        </div>

        <div className="flex gap-2 mt-2">
            <button 
              disabled={isSaving}
              onClick={async () => {
                setIsSaving(true);
                const formData = new FormData();
                formData.append("slug", (document.getElementById(`slug-m-${category.id}`) as HTMLInputElement).value);
                formData.append("title_ru", (document.getElementById(`ru-m-${category.id}`) as HTMLInputElement).value);
                formData.append("title_az", (document.getElementById(`az-m-${category.id}`) as HTMLInputElement).value);
                await adminUpdateCategory(category.id, formData);
                setIsSaving(false);
                onCancel();
              }}
              className="flex-1 h-10 bg-emerald-600 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition disabled:opacity-70"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              <span>{isSaving ? "Сохранение..." : "Сохранить"}</span>
            </button>
            <button onClick={onCancel} className="h-10 w-10 bg-white border border-slate-200 text-slate-600 rounded-lg flex items-center justify-center active:scale-95 transition">
              <X size={18} />
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 flex flex-col gap-2 relative group active:bg-slate-50 transition-colors ${isDeleting ? 'bg-rose-50 opacity-50 pointer-events-none' : ''}`}>
      <div className="flex justify-between items-start">
         <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-slate-400">#{category.id}</span>
                <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                    {category.slug}
                </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">{category.title_ru}</h3>
            <div className="flex items-center gap-1.5 mt-0.5 text-sm text-slate-500">
                <Globe size={12} className="text-slate-400" />
                {category.title_az || <span className="text-slate-300 italic">Нет перевода</span>}
            </div>
         </div>

         {/* Кнопки действий */}
         <div className="flex gap-1">
            <button onClick={onEdit} className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-50 text-slate-600 border border-slate-100 active:scale-95 transition">
                <Pencil size={16} />
            </button>
            <button 
                onClick={onDelete} 
                disabled={isDeleting}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 border border-rose-100 active:scale-95 transition disabled:opacity-50"
            >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            </button>
         </div>
      </div>
    </div>
  );
}