"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

type Props = {
  title: string;
  lang: string;
};

export function ShareButton({ title, lang }: Props) {
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const text = lang === "ru" ? "Поделиться" : "Paylaş";

    // 1. Пробуем нативное меню (iOS/Android)
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        });
        return;
      } catch (err) {
        console.log("Share cancelled");
      }
    }

    // 2. Если нативное меню недоступно (Desktop), копируем ссылку
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const label = lang === "ru" ? "Поделиться" : "Paylaş";
  const copiedLabel = lang === "ru" ? "Скопировано" : "Kopyalandı";

  return (
    <button 
      onClick={handleShare}
      className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-amber-600 transition-colors active:scale-95"
    >
      {isCopied ? <Check size={16} /> : <Share2 size={16} />}
      {isCopied ? copiedLabel : label}
    </button>
  );
}