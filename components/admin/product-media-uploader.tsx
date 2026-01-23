"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { adminAddProductMedia } from "@/lib/actions/products";
import { Loader2, Upload, ImagePlus, CheckCircle2 } from "lucide-react";
import imageCompression from "browser-image-compression"; // Импорт сжатия

export function ProductMediaUploader({ productId }: { productId: number }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function onPick(file: File) {
    if (!file) return;
    setLoading(true);
    setStatus("Подготовка...");

    try {
      const isVideo = file.type.startsWith("video/");
      let fileToUpload = file;
      let fileExt = file.name.split(".").pop();

      // --- ЛОГИКА СЖАТИЯ (Только для фото) ---
      if (!isVideo) {
        setStatus("Сжатие...");
        
        const options = {
          maxSizeMB: 1,              // Максимальный вес 1 МБ
          maxWidthOrHeight: 1920,    // Макс. ширина/высота (Full HD достаточно)
          useWebWorker: true,        // Использовать многопоточность (чтобы не завис интерфейс)
          fileType: "image/webp",    // Конвертируем в WebP
          initialQuality: 0.8,       // Качество 80%
        };

        try {
          const compressedFile = await imageCompression(file, options);
          fileToUpload = compressedFile;
          fileExt = "webp"; // Теперь это webp
          console.log(`Сжато: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
        } catch (error) {
          console.error("Ошибка сжатия, грузим оригинал", error);
        }
      }

      // --- ЗАГРУЗКА ---
      setStatus("Загрузка...");
      
      const path = `${productId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: upErr } = await supabase.storage
        .from("products")
        .upload(path, fileToUpload, {
          cacheControl: "3600",
          upsert: false,
          contentType: isVideo ? file.type : "image/webp", // Важно указать правильный тип
        });

      if (upErr) throw upErr;

      // Получаем ссылку
      const { data } = supabase.storage.from("products").getPublicUrl(path);
      
      // Сохраняем в БД
      setStatus("Сохранение...");
      await adminAddProductMedia(productId, data.publicUrl, isVideo ? "video" : "image");
      
      setStatus("Готово!");
      setTimeout(() => setStatus(null), 2000); // Скрыть статус через 2 сек

    } catch (e: any) {
      alert(e?.message || "Ошибка загрузки");
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <label 
        className={`
          inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl 
          text-xs font-bold uppercase tracking-wider cursor-pointer transition-all
          ${loading 
            ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
            : "bg-slate-900 text-white hover:bg-black hover:shadow-lg active:scale-95"
          }
        `}
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : status === "Готово!" ? (
          <CheckCircle2 size={16} className="text-emerald-400" />
        ) : (
          <ImagePlus size={16} />
        )}
        
        <span>{status || "Загрузить фото"}</span>
        
        <input
          type="file"
          accept="image/*,video/*"
          className="hidden"
          disabled={loading}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onPick(f);
            e.currentTarget.value = ""; // Сброс, чтобы можно было выбрать тот же файл
          }}
        />
      </label>
      
      {!loading && !status && (
        <div className="hidden sm:block text-[10px] text-slate-400 leading-tight max-w-[150px]">
          Автосжатие в WebP • Макс 1920px
        </div>
      )}
    </div>
  );
}