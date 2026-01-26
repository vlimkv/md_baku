import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getPublicPostBySlug } from "@/lib/actions/public-blog";
import { Lang } from "@/lib/data";
import { ChevronLeft, CalendarDays } from "lucide-react";
// 👇 Импортируем новую кнопку
import { ShareButton } from "@/components/blog/share-button"; 

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = await getPublicPostBySlug(slug, lang as Lang);
  if (!post) return { title: "Not Found" };
  
  return {
    title: post.seo_title || post.title,
    description: post.seo_desc || post.excerpt?.slice(0, 160),
    openGraph: {
      images: post.cover_image ? [post.cover_image] : [],
    }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { lang, slug } = await params;

  if (lang !== "ru" && lang !== "az") notFound();

  const post = await getPublicPostBySlug(slug, lang as Lang);
  if (!post) notFound();

  const date = new Date(post.published_at).toLocaleDateString(
    lang === "ru" ? "ru-RU" : "az-AZ", 
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* HERO IMAGE */}
      {post.cover_image && (
        <div className="relative w-full h-[40vh] md:h-[50vh] bg-slate-900">
           <Image 
             src={post.cover_image} 
             alt={post.title}
             fill
             className="object-cover opacity-80"
             priority
           />
           <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 relative z-10 -mt-20 md:-mt-32">
        
        {/* NAV BACK */}
        <div className="mb-6">
            <Link 
                href={`/${lang}/blog`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur rounded-full text-xs font-bold uppercase tracking-wider text-slate-900 shadow-sm hover:bg-amber-50 hover:text-amber-700 transition-colors"
            >
                <ChevronLeft size={14} /> 
                {lang === 'ru' ? 'Назад в блог' : 'Bloqa qayıt'}
            </Link>
        </div>

        {/* HEADER */}
        <div className="bg-white rounded-t-3xl md:rounded-3xl border-x border-t md:border border-gray-100 p-6 md:p-12 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between text-slate-400 text-sm font-medium mb-6">
                <div className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-amber-500" />
                    {date}
                </div>
                {/* 👇 Вставляем работающую кнопку */}
                <ShareButton title={post.title} lang={lang} />
            </div>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-8">
                {post.title}
            </h1>

            {/* CONTENT (Rich Text) */}
            <div 
                className="prose prose-lg prose-slate max-w-none 
                prose-headings:font-black prose-headings:text-slate-900 
                prose-p:text-slate-600 prose-p:leading-relaxed 
                prose-a:text-amber-600 hover:prose-a:text-amber-700 
                prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8
                prose-li:marker:text-amber-500"
                dangerouslySetInnerHTML={{ __html: post.content || "" }} 
            />
        </div>

        {/* 👇 КНОПКА "ПЕРЕЙТИ В КАТАЛОГ" УДАЛЕНА */}

      </div>
    </div>
  );
}