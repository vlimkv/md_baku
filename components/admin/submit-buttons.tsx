"use client";

import { useFormStatus } from "react-dom";
import { 
  Loader2, Save, Power, BoxSelect, Trash2, CheckCircle2, XCircle, Star 
} from "lucide-react";

// --- 1. Кнопка "Создать / Сохранить" (Широкая) ---
export function SaveBtn({ label = "Сохранить" }: { label?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="w-full h-12 bg-slate-900 hover:bg-black text-white rounded-xl text-sm font-black uppercase tracking-wider shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
      <span>{pending ? "Загрузка..." : label}</span>
    </button>
  );
}

// --- 2. Кнопка ВКЛ/ВЫКЛ (Адаптивная) ---
export function ToggleActiveBtn({ isActive, mobile = false }: { isActive: boolean; mobile?: boolean }) {
  const { pending } = useFormStatus();

  if (mobile) {
    // Версия для мобильной карточки (iPhone style)
    return (
      <button
        disabled={pending}
        className={`w-full flex flex-col items-center justify-center p-2 rounded-xl active:scale-95 transition-transform disabled:opacity-50 ${
          isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
        }`}
      >
        {pending ? <Loader2 size={20} className="animate-spin" /> : (isActive ? <CheckCircle2 size={20} /> : <XCircle size={20} />)}
        <span className="text-[9px] font-bold mt-1 uppercase">{isActive ? 'ВКЛ' : 'ВЫКЛ'}</span>
      </button>
    );
  }

  // Версия для ПК (Компактная)
  return (
    <button disabled={pending} className={`p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition-all disabled:opacity-50 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
      {pending ? <Loader2 size={14} className="animate-spin" /> : <Power size={14} />}
    </button>
  );
}

// --- 3. Кнопка НАЛИЧИЕ (Адаптивная) ---
export function ToggleStockBtn({ inStock, mobile = false }: { inStock: boolean; mobile?: boolean }) {
  const { pending } = useFormStatus();

  if (mobile) {
    return (
      <button
        disabled={pending}
        className={`w-full flex flex-col items-center justify-center p-2 rounded-xl active:scale-95 transition-transform disabled:opacity-50 ${
          inStock ? 'bg-blue-50 text-blue-700' : 'bg-rose-50 text-rose-700'
        }`}
      >
        {pending ? <Loader2 size={20} className="animate-spin" /> : <BoxSelect size={20} />}
        <span className="text-[9px] font-bold mt-1 uppercase">{inStock ? 'ЕСТЬ' : 'НЕТ'}</span>
      </button>
    );
  }

  return (
    <button disabled={pending} className={`p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition-all disabled:opacity-50 ${inStock ? 'text-blue-600' : 'text-slate-400'}`}>
      {pending ? <Loader2 size={14} className="animate-spin" /> : <BoxSelect size={14} />}
    </button>
  );
}

// --- 4. Кнопка УДАЛИТЬ (Адаптивная) ---
export function DeleteBtn({ mobile = false }: { mobile?: boolean }) {
  const { pending } = useFormStatus();

  if (mobile) {
    return (
      <button
        disabled={pending}
        className="w-full flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 active:bg-rose-50 active:text-rose-600 active:border-rose-200 transition-all active:scale-95 disabled:opacity-50"
      >
        {pending ? <Loader2 size={20} className="animate-spin text-rose-600" /> : <Trash2 size={20} />}
        <span className="text-[9px] font-bold mt-1 uppercase text-rose-600">УДАЛ.</span>
      </button>
    );
  }

  return (
    <button disabled={pending} className="p-2 rounded-lg hover:bg-rose-50 hover:border-rose-100 hover:text-rose-600 text-slate-300 transition-all disabled:opacity-50">
      {pending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
    </button>
  );
}

// --- 5. Кнопка ОБНОВИТЬ СЕКЦИИ (Фиолетовая) ---
export function SaveCollectionsBtn() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="w-full bg-indigo-600 text-white h-12 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2">
      {pending ? <Loader2 size={16} className="animate-spin" /> : null}
      <span>{pending ? "Сохранение..." : "Обновить секции"}</span>
    </button>
  );
}

// --- 6. Кнопка для Переводов (Светлая) ---
export function SaveTranslationBtn() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 h-12 rounded-xl text-xs font-black uppercase tracking-wider transition-colors active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
      {pending ? <Loader2 size={16} className="animate-spin" /> : null}
      <span>{pending ? "Сохраняем..." : "Сохранить перевод"}</span>
    </button>
  );
}

// --- 7. Кнопка Media Actions (Main/Delete) ---
export function MediaActionBtn({ type }: { type: 'main' | 'delete' }) {
  const { pending } = useFormStatus();

  if (type === 'main') {
    return (
      <button disabled={pending} className="w-full py-1.5 rounded-lg bg-slate-50 text-slate-600 text-[10px] font-bold uppercase hover:bg-emerald-50 hover:text-emerald-600 transition-colors disabled:opacity-50 flex justify-center">
        {pending ? <Loader2 size={12} className="animate-spin" /> : "Main"}
      </button>
    );
  }

  return (
    <button disabled={pending} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 flex justify-center">
      {pending ? <Loader2 size={16} className="animate-spin text-red-500" /> : <Trash2 size={16} />}
    </button>
  );
}