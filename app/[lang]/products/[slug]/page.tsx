export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublicProductBySlug } from "@/lib/actions/public";
import { siteContent, Lang } from "@/lib/data";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductCard } from "@/components/product/product-card"; 
import { ShareButton, AddToCartButton, BuyNowButton } from "@/components/product/product-actions"; 
import { FloatingCart } from "@/components/ui/floating-cart"; 

import { 
  X, Phone, ShieldCheck, Truck, 
  ChevronRight, ArrowRight 
} from "lucide-react";

// Иконка WhatsApp
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="mr-2 mb-0.5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

// Метаданные (SEO)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const product = await getPublicProductBySlug(slug, lang as Lang);
  if (!product) return { title: "Not Found" };
  return {
    title: product.seo_title || product.title,
    description: product.seo_desc || product.description?.slice(0, 160),
    openGraph: {
      images: product.image ? [product.image] : [],
      title: product.title,
      description: product.description?.slice(0, 160) || "",
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { lang, slug } = await params;
  
  if (lang !== "ru" && lang !== "az") notFound();

  const product = await getPublicProductBySlug(slug, lang as Lang);
  if (!product) notFound();

  const content = siteContent[lang as Lang];
  const t = content.productPage;
  const tCard = content.productCard;

  // 👇 ЛОКАЛЬНЫЕ ПЕРЕВОДЫ ДЛЯ НАВИГАЦИИ И КНОПОК
  const navT = {
    ru: {
      home: "Главная", // Или "MD Baku", если хочешь оставить бренд
      catalog: "Каталог",
      whatsappBtn: "WhatsApp"
    },
    az: {
      home: "Ana Səhifə", // Или "MD Baku"
      catalog: "Kataloq",
      whatsappBtn: "WhatsApp"
    }
  }[lang as Lang];

  const discount = product.old_price 
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32 md:pb-20">
      
      {/* Floating Cart (С отступом снизу для мобилок) */}
      <FloatingCart className="bottom-28" />

      {/* Breadcrumbs (Навигация) */}
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        <nav className="flex items-center text-xs font-medium text-slate-500 overflow-hidden whitespace-nowrap scrollbar-hide">
          <Link href={`/${lang}`} className="hover:text-amber-600 transition">
             {/* Перевод для главной */}
             {navT.home} 
          </Link>
          <ChevronRight size={14} className="mx-2 text-slate-300 flex-shrink-0" />
          <Link href={`/${lang}/products`} className="hover:text-amber-600 transition">
             {/* Перевод для каталога */}
             {navT.catalog} 
          </Link>
          <ChevronRight size={14} className="mx-2 text-slate-300 flex-shrink-0" />
          <span className="text-slate-800 truncate">{product.title}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
            
            {/* LEFT COLUMN */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6 lg:space-y-10 min-w-0">
               <div className="bg-transparent lg:bg-white lg:rounded-3xl lg:border lg:border-slate-100 lg:p-6 lg:shadow-sm">
                  <ProductGallery media={product.media} title={product.title} />
               </div>

               <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-10 shadow-sm overflow-hidden">
                  <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
                    {t.description}
                  </h2>
                  {product.description ? (
                     <div 
                       className="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-amber-600 prose-a:font-bold hover:prose-a:text-amber-700 prose-ul:list-disc prose-ul:pl-5 prose-li:marker:text-amber-500 prose-img:rounded-2xl prose-img:shadow-sm prose-img:my-6 prose-strong:text-slate-900 prose-strong:font-black"
                       dangerouslySetInnerHTML={{ __html: product.description }}
                     />
                  ) : (
                     <p className="text-slate-400 italic bg-slate-50 p-4 rounded-xl text-sm">{t.descriptionEmpty}</p>
                  )}
               </div>

               {product.specs && Object.keys(product.specs).length > 0 && (
                 <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-10 shadow-sm">
                    <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                      <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
                      {t.specs}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
                        {Object.entries(product.specs).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-baseline border-b border-slate-50 py-3 last:border-0 hover:bg-slate-50/50 transition-colors px-2 -mx-2 rounded-lg">
                              <span className="text-sm text-slate-500 font-medium">{key}</span>
                              <span className="text-sm text-slate-900 font-bold text-right ml-4">{value as string}</span>
                          </div>
                        ))}
                    </div>
                 </div>
               )}
            </div>

            {/* RIGHT COLUMN (STICKY) */}
            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-6">
               <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)]">
                  
                  {/* Category & Actions */}
                  <div className="flex justify-between items-start mb-4">
                     <div className="flex flex-wrap gap-2">
                        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-2.5 py-1.5 rounded-lg">
                           {product.category_title}
                        </span>
                        {product.badge && (
                           <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-slate-900 px-2.5 py-1.5 rounded-lg shadow-sm">
                              {product.badge}
                           </span>
                        )}
                     </div>
                     <ShareButton />
                  </div>

                  <h1 className="text-2xl md:text-[28px] font-black text-slate-900 leading-[1.15] mb-2">
                    {product.title}
                  </h1>
                  
                  <div className="text-xs text-slate-400 font-mono font-medium mb-6 flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                     {t.sku} {product.id}
                  </div>

                  <div className="mb-6 p-5 bg-slate-50/80 rounded-2xl border border-slate-100 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full blur-3xl opacity-60 -translate-y-10 translate-x-10 pointer-events-none"></div>
                     <div className="flex items-end gap-3 mb-2 relative z-10">
                        <span className="text-4xl font-black text-slate-900 tracking-tight">
                           {product.price} <span className="text-xl text-slate-400">{t.currency}</span>
                        </span>
                        {product.old_price && (
                           <div className="flex flex-col mb-1.5">
                              <span className="text-sm text-slate-400 line-through font-bold decoration-rose-300">{product.old_price}</span>
                              {discount > 0 && <span className="text-[10px] font-black text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded-md">-{discount}%</span>}
                           </div>
                        )}
                     </div>
                     <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${product.in_stock ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {product.in_stock 
                           ? <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> {t.inStock}</div> 
                           : <div className="flex items-center gap-1.5"><X size={14} strokeWidth={3} /> {t.outOfStock}</div>
                        }
                     </div>
                  </div>

                  {/* Desktop Actions */}
                  <div className="space-y-3 hidden md:block">
                     <AddToCartButton 
                        id={product.id}
                        slug={product.slug}
                        image={product.image}
                        text={t.addToCart} 
                        price={product.price} 
                        title={product.title}
                        className="group w-full h-14 bg-slate-900 hover:bg-amber-600 text-white rounded-2xl font-bold uppercase tracking-wider transition-all shadow-xl shadow-slate-900/10 hover:shadow-amber-600/25 active:scale-[0.98] flex items-center justify-center gap-3" 
                     />
                     
                     <div className="grid grid-cols-2 gap-3">
                        {/* КНОПКА WHATSAPP (Переведена) */}
                        <a 
                            href={`https://wa.me/994552677811?text=${tCard.waText} ${product.title}`} 
                            target="_blank" 
                            className="h-12 border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 rounded-2xl font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 transition-all"
                        >
                           <WhatsAppIcon /> {navT.whatsappBtn}
                        </a>
                        <a href="tel:+994552677811" className="h-12 border border-slate-200 hover:border-slate-900 hover:bg-slate-50 hover:text-slate-900 text-slate-600 rounded-2xl font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 transition-all">
                           <Phone size={18} /> {t.orderPhone}
                        </a>
                     </div>
                  </div>

                  {/* Features */}
                  <div className="mt-8 space-y-5 pt-8 border-t border-slate-100">
                     <div className="flex items-start gap-4 group">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                           <ShieldCheck size={20} />
                        </div>
                        <div>
                           <h4 className="text-sm font-bold text-slate-900">{t.garanty}</h4>
                           <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{t.garantyDesc}</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-4 group">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                           <Truck size={20} />
                        </div>
                        <div>
                           <h4 className="text-sm font-bold text-slate-900">{t.delivery}</h4>
                           <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{t.deliveryDesc}</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
        </div>

        {/* RELATED PRODUCTS */}
        {product.related_products.length > 0 && (
           <div className="mt-24 border-t border-slate-200 pt-12">
              <div className="flex items-center justify-between mb-8 px-2">
                 <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{t.related}</h2>
                 <Link href={`/${lang}/products`} className="hidden md:flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 transition bg-amber-50 px-4 py-2 rounded-full">
                    {t.viewAll} <ArrowRight size={16} />
                 </Link>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                 {product.related_products.map(p => (
                    <div key={p.id} className="min-w-0"> 
                       <ProductCard product={p} lang={lang as Lang} />
                    </div>
                 ))}
              </div>
           </div>
        )}
      </div>

      {/* === MOBILE STICKY BOTTOM BAR === */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 md:hidden z-50 safe-area-pb shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
         <div className="flex gap-3 max-w-lg mx-auto">
            <div className="flex-1 flex flex-col justify-center">
               <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.priceLabel}</div>
               <div className="text-xl font-black text-slate-900 leading-none flex items-baseline gap-1">
                  {product.price} <span className="text-sm font-bold text-slate-500">{t.currency}</span>
               </div>
            </div>
            {/* 👇 ЖИВАЯ КНОПКА ПОКУПКИ */}
            <BuyNowButton text={t.buyNow} product={product} />
         </div>
      </div>

    </div>
  );
}