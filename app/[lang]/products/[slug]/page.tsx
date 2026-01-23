export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublicProductBySlug } from "@/lib/actions/public";
import { Lang } from "@/lib/data";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductCard } from "@/components/product/ProductCard";
import { Check, X, Phone, MessageCircle, ShieldCheck, Truck } from "lucide-react";

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

// --- SEO ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const product = await getPublicProductBySlug(slug, lang as Lang);

  if (!product) return { title: "Not Found" };

  return {
    title: product.seo_title || product.title,
    description: product.seo_desc || product.description?.slice(0, 160),
    openGraph: {
      images: product.image ? [product.image] : [],
    },
  };
}

// --- PAGE ---
export default async function ProductPage({ params }: Props) {
  const { lang, slug } = await params;
  
  // Валидация языка
  if (lang !== "ru" && lang !== "az") notFound();

  const product = await getPublicProductBySlug(slug, lang as Lang);
  if (!product) notFound();

  // Словарик для интерфейса
  const t = {
    ru: {
      sku: "Артикул",
      inStock: "В наличии",
      outOfStock: "Нет в наличии",
      addToCart: "В корзину",
      orderPhone: "Заказать по телефону",
      description: "Описание",
      specs: "Характеристики",
      related: "Похожие товары",
      garanty: "Официальная гарантия",
      delivery: "Доставка по всему Азербайджану",
      currency: "₼"
    },
    az: {
      sku: "Artikul",
      inStock: "Anbarda var",
      outOfStock: "Bitib",
      addToCart: "Səbətə at",
      orderPhone: "Telefonda sifariş",
      description: "Təsvir",
      specs: "Xüsusiyyətlər",
      related: "Oxşar məhsullar",
      garanty: "Rəsmi zəmanət",
      delivery: "Bütün Azərbaycan üzrə çatdırılma",
      currency: "₼"
    }
  }[lang as Lang];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      
      {/* Breadcrumbs (упрощенно) */}
      <div className="max-w-7xl mx-auto px-4 py-4 text-xs font-medium text-gray-500 overflow-hidden">
        <Link href={`/${lang}`} className="hover:text-amber-600 transition">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/${lang}/products`} className="hover:text-amber-600 transition">Catalog</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-400">{product.category_title}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-[2rem] border border-gray-100 p-6 md:p-10 shadow-sm">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
            
            {/* LEFT: GALLERY */}
            <div className="lg:col-span-6 xl:col-span-5">
               <ProductGallery media={product.media} title={product.title} />
            </div>

            {/* RIGHT: INFO */}
            <div className="lg:col-span-6 xl:col-span-7 flex flex-col">
               
               {/* Category & Badge */}
               <div className="flex items-center gap-3 mb-4">
                  {product.badge && (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                      {product.badge}
                    </span>
                  )}
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                    {product.category_title}
                  </span>
               </div>

               <h1 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight mb-6">
                 {product.title}
               </h1>

               {/* Price & Actions */}
               <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 mb-8">
                  <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                     <div>
                        {product.old_price && (
                           <div className="text-sm font-bold text-gray-400 line-through mb-1">
                              {product.old_price} {t.currency}
                           </div>
                        )}
                        <div className="text-4xl font-black text-gray-900">
                           {product.price} <span className="text-xl text-gray-500 font-bold">{t.currency}</span>
                        </div>
                     </div>

                     <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${product.in_stock ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {product.in_stock ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
                        {product.in_stock ? t.inStock : t.outOfStock}
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                     <button className="flex-1 h-14 bg-gray-900 hover:bg-amber-600 text-white rounded-xl font-bold uppercase tracking-wider transition-colors shadow-lg shadow-gray-900/10 hover:shadow-amber-600/20 active:scale-[0.98]">
                        {t.addToCart}
                     </button>
                     <a href="tel:+994552677811" className="flex-1 h-14 border-2 border-gray-200 hover:border-gray-900 text-gray-900 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors">
                        <Phone size={18} /> {t.orderPhone}
                     </a>
                  </div>
               </div>

               {/* Features */}
               <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-100">
                     <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <ShieldCheck size={20} />
                     </div>
                     <span className="text-xs font-bold text-gray-600 leading-tight">{t.garanty}</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-100">
                     <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Truck size={20} />
                     </div>
                     <span className="text-xs font-bold text-gray-600 leading-tight">{t.delivery}</span>
                  </div>
               </div>

               {/* Whatsapp Button */}
               <a 
                 href={`https://wa.me/994552677811?text=Salam, bu məhsul barədə maraqlanıram: ${product.title}`}
                 target="_blank"
                 className="flex items-center gap-3 text-emerald-600 hover:text-emerald-700 font-bold text-sm transition-colors mt-auto"
               >
                  <MessageCircle size={20} /> Whatsapp
               </a>

            </div>
          </div>
        </div>

        {/* --- TABS SECTION (Description & Specs) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
           
           {/* Description */}
           <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 p-6 md:p-10 shadow-sm">
              <h2 className="text-xl font-black text-gray-900 mb-6">{t.description}</h2>
              {product.description ? (
                 <div 
                   className="prose prose-sm md:prose-base prose-slate max-w-none prose-headings:font-bold prose-a:text-amber-600"
                   dangerouslySetInnerHTML={{ __html: product.description }}
                 />
              ) : (
                 <p className="text-gray-400 italic">Описание отсутствует...</p>
              )}
           </div>

           {/* Specs */}
           <div className="bg-white rounded-[2rem] border border-gray-100 p-6 md:p-8 shadow-sm h-fit">
              <h2 className="text-xl font-black text-gray-900 mb-6">{t.specs}</h2>
              
              {product.specs && Object.keys(product.specs).length > 0 ? (
                 <div className="space-y-4">
                    {Object.entries(product.specs).map(([key, value]) => (
                       <div key={key} className="flex justify-between items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                          <span className="text-sm font-medium text-gray-500">{key}</span>
                          <span className="text-sm font-bold text-gray-900 text-right pl-4">{value as string}</span>
                       </div>
                    ))}
                 </div>
              ) : (
                 <p className="text-gray-400 text-sm">Характеристики не указаны</p>
              )}
           </div>
        </div>

        {/* --- RELATED PRODUCTS --- */}
        {product.related_products.length > 0 && (
           <div className="mt-16 md:mt-24">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-8 text-center">{t.related}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 {product.related_products.map(p => (
                    <ProductCard key={p.id} product={p} lang={lang as Lang} />
                 ))}
              </div>
           </div>
        )}

      </div>
    </div>
  );
}