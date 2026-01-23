"use client";

import { useState, useRef } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import imageCompression from "browser-image-compression";
import { ImageIcon, UploadCloud, Loader2, X } from "lucide-react";
import { adminUpdatePostImage, adminDeletePostImage } from "@/lib/actions/blog";

type Props = {
  postId: number;
  initialImage: string | null;
};

export function BlogImageUploader({ postId, initialImage }: Props) {
  const [image, setImage] = useState(initialImage);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- ЛОГИКА ЗАГРУЗКИ ---
  const handleUpload = async (file: File) => {
    if (!file) return;

    try {
      setIsUploading(true);

      // 1. Сжатие на клиенте
      const options = {
        maxSizeMB: 1,           // Макс вес 1MB
        maxWidthOrHeight: 1920, // Макс размер по стороне
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      // 2. Формируем путь: blog/ID_POST/timestamp.ext
      const ext = compressedFile.name.split(".").pop();
      const fileName = `${postId}/${Date.now()}.${ext}`;
      
      const sb = supabaseBrowser();

      // 3. Загружаем в Storage
      const { error: uploadError } = await sb.storage
        .from("blog")
        .upload(fileName, compressedFile);

      if (uploadError) throw uploadError;

      // 4. Получаем публичную ссылку
      const { data: { publicUrl } } = sb.storage
        .from("blog")
        .getPublicUrl(fileName);

      // 5. Сохраняем ссылку в БД
      await adminUpdatePostImage(postId, publicUrl);

      setImage(publicUrl);

    } catch (error: any) {
      console.error("Ошибка загрузки:", error);
      // alert убран, пишем в консоль
    } finally {
      setIsUploading(false);
    }
  };

  // --- ЛОГИКА УДАЛЕНИЯ ---
  const handleRemove = async () => {
    if (!image) return;

    // Оптимистичное обновление (сразу скрываем картинку)
    const prevImage = image;
    setImage(null);

    try {
      // Удаляем из Storage и из БД
      await adminDeletePostImage(postId, prevImage);
    } catch (e) {
      console.error("Ошибка при удалении:", e);
      // Если ошибка — возвращаем картинку обратно
      setImage(prevImage);
    }
  };

  // --- СОБЫТИЯ ---
  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleUpload(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files?.[0]) handleUpload(e.dataTransfer.files[0]);
  };

  return (
    <div className="space-y-4">
      {/* Зона загрузки / Превью */}
      <div 
        className={`relative group aspect-video rounded-xl overflow-hidden border-2 transition-all ${
          isDragOver 
            ? "border-blue-500 bg-blue-50/50 border-dashed" 
            : "border-slate-200 bg-slate-50 border-dashed"
        } ${!image ? "hover:border-blue-300 hover:bg-slate-100" : "border-solid"}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        
        {/* Сценарий 1: Картинка есть */}
        {image ? (
          <>
            <img src={image} alt="Cover" className="w-full h-full object-cover" />
            
            {/* Оверлей кнопок при наведении */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
               <button 
                 onClick={() => fileInputRef.current?.click()}
                 className="bg-white/90 text-slate-900 px-4 py-2 rounded-lg text-xs font-bold mr-2 hover:bg-white active:scale-95 transition-transform"
               >
                 Заменить
               </button>
               <button 
                 onClick={handleRemove}
                 className="bg-rose-500/90 text-white p-2 rounded-lg hover:bg-rose-600 active:scale-95 transition-all"
               >
                 <X size={16} />
               </button>
            </div>
          </>
        ) : (
          /* Сценарий 2: Картинки нет (Загрузка) */
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-slate-400 gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
               <UploadCloud size={24} className="text-blue-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-600">Нажмите или перетащите</p>
              <p className="text-[10px] opacity-70">JPG, PNG, WEBP (до 1MB)</p>
            </div>
          </div>
        )}

        {/* Лоадер */}
        {isUploading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <Loader2 size={32} className="text-blue-600 animate-spin mb-2" />
            <span className="text-xs font-bold text-blue-600 animate-pulse">Загрузка...</span>
          </div>
        )}
      </div>

      {/* Скрытый инпут файла */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={onFileSelect} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Вставка ссылки вручную (опционально) */}
      <details className="text-xs text-slate-400">
        <summary className="cursor-pointer hover:text-blue-600 transition-colors list-none flex items-center gap-1">
           <ImageIcon size={12} />
           <span>Вставить ссылку вручную</span>
        </summary>
        <div className="mt-2 flex gap-2">
           <input 
             placeholder="https://..." 
             className="flex-1 h-9 px-3 rounded-lg border border-slate-200 bg-white text-slate-900"
             defaultValue={image || ""}
             onBlur={(e) => {
                if (e.target.value && e.target.value !== image) {
                   adminUpdatePostImage(postId, e.target.value);
                   setImage(e.target.value);
                }
             }}
           />
        </div>
      </details>
    </div>
  );
}