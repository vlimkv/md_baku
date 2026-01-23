"use client";

import { useState } from "react";
import Image from "next/image"; // Если домены настроены, иначе <img />

type Props = {
  media: { url: string; kind: 'image' | 'video' }[];
  title: string;
};

export function ProductGallery({ media, title }: Props) {
  const [activeUrl, setActiveUrl] = useState(media[0]?.url || "");

  if (media.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-3xl flex items-center justify-center text-gray-400 font-bold">
        NO IMAGE
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="aspect-square relative bg-white rounded-3xl border border-gray-100 overflow-hidden flex items-center justify-center p-2">
        <img 
          src={activeUrl} 
          alt={title} 
          className="object-contain w-full h-full animate-fade-in"
        />
      </div>

      {/* Thumbnails */}
      {media.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {media.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveUrl(item.url)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden bg-white p-1 transition-all ${
                activeUrl === item.url 
                  ? "border-amber-500 shadow-md scale-105" 
                  : "border-transparent hover:border-gray-200"
              }`}
            >
              <img 
                src={item.url} 
                alt={`${title} ${idx}`} 
                className="object-contain w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}