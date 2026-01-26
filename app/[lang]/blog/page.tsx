import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublicPosts } from "@/lib/actions/public-blog";
import { Lang } from "@/lib/data";
import { BlogCard } from "@/components/blog/blog-card";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ page?: string }>;
};

const DICT = {
  ru: {
    title: "Блог и Новости",
    subtitle: "Полезные советы, обзоры оборудования и новости компании.",
    empty: "Статьи пока не добавлены.",
  },
  az: {
    title: "Bloq və Xəbərlər",
    subtitle: "Faydalı məsləhətlər, avadanlıq icmalları və şirkət xəbərləri.",
    empty: "Məqalələr hələ əlavə edilməyib.",
  }
};

export default async function BlogPage({ params, searchParams }: Props) {
  const { lang } = await params;
  const sp = await searchParams;

  if (lang !== "ru" && lang !== "az") notFound();
  
  const t = DICT[lang as Lang];
  const currentPage = Number(sp.page) || 1;
  
  const { rows, totalCount } = await getPublicPosts(lang as Lang, currentPage);
  
  const LIMIT = 9;
  const totalPages = Math.ceil(totalCount / LIMIT);

  return (
    // min-h-[100dvh] для корректной работы на мобилках с адресной строкой
    <div className="min-h-[100dvh] bg-[#F8F9FA] pb-20">
      
      {/* HEADER: Убрал bg-white и border-b, теперь фон единый */}
      <div className="pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          {/* Иконка: сделал фон белым (bg-white) чтобы выделялась на сером */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white text-amber-600 rounded-3xl mb-6 shadow-sm shadow-slate-200">
             <BookOpen size={32} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            {t.title}
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8">
        {/* GRID */}
        {rows.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {rows.map((post) => (
              <BlogCard key={post.id} post={post} lang={lang as Lang} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
            <p className="text-slate-400 font-medium text-lg">{t.empty}</p>
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center gap-2">
            {currentPage > 1 && (
                <Link href={`/${lang}/blog?page=${currentPage - 1}`} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-200 hover:border-amber-500 text-slate-600 transition-colors shadow-sm">
                    <ChevronLeft size={20} />
                </Link>
            )}
            <span className="h-12 px-6 flex items-center justify-center rounded-2xl bg-slate-900 text-white font-bold shadow-lg shadow-slate-900/20">
                {currentPage} / {totalPages}
            </span>
            {currentPage < totalPages && (
                <Link href={`/${lang}/blog?page=${currentPage + 1}`} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-200 hover:border-amber-500 text-slate-600 transition-colors shadow-sm">
                    <ChevronRight size={20} />
                </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}