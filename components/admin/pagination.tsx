"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const { replace } = useRouter();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        disabled={currentPage <= 1}
        onClick={() => createPageURL(currentPage - 1)}
        className="p-3 rounded-xl border-2 border-gray-200 text-gray-500 hover:border-amber-500 hover:text-amber-600 disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all active:scale-95 bg-white"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-1 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-black text-gray-700">
        <span>{currentPage}</span>
        <span className="text-gray-400 font-medium">/</span>
        <span className="text-gray-400 font-medium">{totalPages}</span>
      </div>

      <button
        disabled={currentPage >= totalPages}
        onClick={() => createPageURL(currentPage + 1)}
        className="p-3 rounded-xl border-2 border-gray-200 text-gray-500 hover:border-amber-500 hover:text-amber-600 disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all active:scale-95 bg-white"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}