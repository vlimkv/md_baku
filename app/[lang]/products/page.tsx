import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublicProducts, getNavbarCategories } from "@/lib/actions/public";
import { Lang } from "@/lib/data";
import { ProductCard } from "@/components/product/ProductCard";
import { ChevronLeft, ChevronRight, FilterX, MoreHorizontal } from "lucide-react";

// Types
type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ page?: string; category?: string }>;
};

// UI Translations
const DICT = {
  ru: {
    title: "Каталог товаров",
    subtitle: "Профессиональные металлоискатели и аксессуары",
    allCategories: "Все категории",
    empty: "Товары не найдены",
    reset: "Сбросить фильтр",
    showing: "Показано товаров:",
  },
  az: {
    title: "Məhsul kataloqu",
    subtitle: "Peşəkar metal detektorları və aksesuarlar",
    allCategories: "Bütün kateqoriyalar",
    empty: "Məhsul tapılmadı",
    reset: "Filtrləri sıfırla",
    showing: "Göstərilən məhsullar:",
  }
};

// --- ФУНКЦИЯ ДЛЯ ГЕНЕРАЦИИ УМНОЙ ПАГИНАЦИИ ---
function getPaginationRange(currentPage: number, totalPages: number) {
  const delta = 1; // Сколько страниц показывать сбоку от текущей
  const range = [];
  const rangeWithDots = [];
  let l;

  range.push(1);

  if (totalPages <= 1) return [1];

  for (let i = currentPage - delta; i <= currentPage + delta; i++) {
    if (i < totalPages && i > 1) {
      range.push(i);
    }
  }
  range.push(totalPages);

  for (const i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { lang } = await params;
  const { page, category } = await searchParams;

  // Validate Language
  if (lang !== "ru" && lang !== "az") notFound();
  
  const t = DICT[lang as Lang];
  const currentPage = Number(page) || 1;
  const LIMIT = 12;
  
  // 1. Fetch Data in Parallel
  const [productsData, categories] = await Promise.all([
    getPublicProducts(lang as Lang, currentPage, category),
    getNavbarCategories(lang as Lang)
  ]);

  const { rows, totalCount } = productsData;

  // Calculation
  const totalPages = Math.ceil(totalCount / LIMIT);
  const activeCategoryName = category 
    ? categories.find(c => c.slug === category)?.title 
    : null;

  // Генерируем массив для пагинации (например: [1, '...', 4, 5, 6, '...', 20])
  const paginationRange = getPaginationRange(currentPage, totalPages);

  // Helper для создания ссылок
  const createPageUrl = (p: number | string) => {
    if (p === '...') return '#';
    return `/${lang}/products?page=${p}${category ? `&category=${category}` : ''}`;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      
      {/* --- HEADER --- */}
      <div className="bg-white border-b border-gray-200 py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-3">
            {t.title}
          </h1>
          <p className="text-gray-500 font-medium max-w-xl mx-auto">
            {activeCategoryName ? (
              <span className="text-amber-600">{activeCategoryName}</span>
            ) : (
              t.subtitle
            )}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* --- SIDEBAR (Categories) --- */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
                {t.allCategories}
              </h3>
              
              <ul className="space-y-1">
                {/* "All" Link */}
                <li>
                  <Link 
                    href={`/${lang}/products`}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                      !category 
                        ? "bg-amber-50 text-amber-700" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span>{t.allCategories}</span>
                    {!category && <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                  </Link>
                </li>

                {/* Category Links */}
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link 
                      href={`/${lang}/products?category=${cat.slug}`}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                        category === cat.slug
                          ? "bg-amber-50 text-amber-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span>{cat.title}</span>
                      {category === cat.slug && <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* --- MAIN GRID --- */}
          <div className="flex-1 w-full">
            
            {/* Top Bar info */}
            <div className="flex items-center justify-between mb-6">
               <div className="text-sm font-bold text-gray-500">
                  {t.showing} <span className="text-gray-900">{rows.length}</span> / {totalCount}
               </div>

               {category && (
                 <Link 
                   href={`/${lang}/products`}
                   className="flex items-center gap-2 text-xs font-bold text-rose-500 hover:text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
                 >
                   <FilterX size={14} />
                   {t.reset}
                 </Link>
               )}
            </div>

            {/* Grid */}
            {rows.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rows.map((product) => (
                  <ProductCard key={product.id} product={product} lang={lang as Lang} />
                ))}
              </div>
            ) : (
              // Empty State
              <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                   <FilterX size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t.empty}</h3>
                <Link href={`/${lang}/products`} className="text-amber-600 hover:underline text-sm font-bold">
                  {t.reset}
                </Link>
              </div>
            )}

            {/* --- SMART PAGINATION --- */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2 select-none">
                
                {/* Кнопка НАЗАД */}
                {currentPage > 1 && (
                    <Link
                        href={createPageUrl(currentPage - 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:border-amber-500 hover:text-amber-600 transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </Link>
                )}

                {/* Номера страниц с точками */}
                {paginationRange.map((p, i) => {
                  if (p === '...') {
                     return (
                         <div key={i} className="w-10 h-10 flex items-center justify-center text-gray-400">
                             <MoreHorizontal size={16} />
                         </div>
                     )
                  }
                  
                  const pageNum = Number(p);
                  const isActive = pageNum === currentPage;

                  return (
                    <Link
                      key={i}
                      href={createPageUrl(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                        isActive
                          ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30 cursor-default pointer-events-none"
                          : "bg-white border border-gray-200 text-gray-600 hover:border-amber-500 hover:text-amber-600"
                      }`}
                    >
                      {p}
                    </Link>
                  );
                })}

                {/* Кнопка ВПЕРЕД */}
                {currentPage < totalPages && (
                    <Link
                        href={createPageUrl(currentPage + 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:border-amber-500 hover:text-amber-600 transition-colors"
                    >
                        <ChevronRight size={16} />
                    </Link>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}