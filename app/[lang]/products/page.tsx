import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublicProducts, getNavbarCategories } from "@/lib/actions/public";
import { Lang } from "@/lib/data";
import { ProductCard } from "@/components/product/product-card";
import { CatalogFilters } from "@/components/catalog/catalog-filters"; 
import { MobileFiltersDrawer } from "@/components/catalog/mobile-filters-drawer"; 
import { ChevronLeft, ChevronRight, FilterX, MoreHorizontal, Search } from "lucide-react";

// Types
type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ 
    page?: string; 
    category?: string;
    min?: string;
    max?: string;
    sort?: string;
    stock?: string;
    search?: string; // 1. Добавил search в типы
  }>;
};

// UI Translations
const DICT = {
  ru: {
    title: "Каталог",
    subtitle: "Профессиональные металлоискатели",
    allCategories: "Категории",
    empty: "Товары не найдены",
    reset: "Сбросить все",
    showing: "Найдено:",
    products: "товаров",
    filterBtn: "Фильтры",
    searchResults: "Результаты поиска:"
  },
  az: {
    title: "Kataloq",
    subtitle: "Peşəkar metal detektorları",
    allCategories: "Kateqoriyalar",
    empty: "Məhsul tapılmadı",
    reset: "Sıfırla",
    showing: "Tapıldı:",
    products: "məhsul",
    filterBtn: "Filtrlər",
    searchResults: "Axtarış nəticələri:"
  }
};

// Pagination helper
function getPaginationRange(currentPage: number, totalPages: number) {
  const delta = 1;
  const range = [];
  const rangeWithDots = [];
  let l;
  range.push(1);
  if (totalPages <= 1) return [1];
  for (let i = currentPage - delta; i <= currentPage + delta; i++) {
    if (i < totalPages && i > 1) range.push(i);
  }
  range.push(totalPages);
  for (const i of range) {
    if (l) {
      if (i - l === 2) rangeWithDots.push(l + 1);
      else if (i - l !== 1) rangeWithDots.push('...');
    }
    rangeWithDots.push(i);
    l = i;
  }
  return rangeWithDots;
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { lang } = await params;
  const sp = await searchParams;

  if (lang !== "ru" && lang !== "az") notFound();
  
  const t = DICT[lang as Lang];
  const currentPage = Number(sp.page) || 1;
  
  // 2. Подготовка фильтров для API (добавил search)
  const filters = {
    categorySlug: sp.category,
    minPrice: sp.min ? Number(sp.min) : undefined,
    maxPrice: sp.max ? Number(sp.max) : undefined,
    inStock: sp.stock === '1',
    sort: sp.sort,
    search: sp.search // <--- Передаем поиск в API
  };
  
  // 3. Fetch Data
  const [productsData, categories] = await Promise.all([
    getPublicProducts(lang as Lang, currentPage, filters),
    getNavbarCategories(lang as Lang)
  ]);

  const { rows, totalCount } = productsData;
  const LIMIT = 12;
  const totalPages = Math.ceil(totalCount / LIMIT);
  const paginationRange = getPaginationRange(currentPage, totalPages);

  // 4. Helper для URL пагинации (сохраняем search при переходе по страницам)
  const createPageUrl = (p: number | string) => {
    if (p === '...') return '#';
    const newParams = new URLSearchParams();
    if (sp.category) newParams.set("category", sp.category);
    if (sp.min) newParams.set("min", sp.min);
    if (sp.max) newParams.set("max", sp.max);
    if (sp.sort) newParams.set("sort", sp.sort);
    if (sp.stock) newParams.set("stock", sp.stock);
    if (sp.search) newParams.set("search", sp.search); // <--- Сохраняем поиск
    newParams.set("page", p.toString());
    return `/${lang}/products?${newParams.toString()}`;
  };

  // Считаем активные фильтры для бейджика и кнопки сброса
  let activeFiltersCount = 0;
  if (sp.min) activeFiltersCount++;
  if (sp.max) activeFiltersCount++;
  if (sp.stock) activeFiltersCount++;
  if (sp.sort && sp.sort !== 'popular') activeFiltersCount++;
  if (sp.search) activeFiltersCount++; // <--- Поиск тоже считается фильтром

  const hasAnyFilter = sp.category || activeFiltersCount > 0;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 pt-8 pb-8 md:pt-12 md:pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">
            {sp.search ? (
                <span className="flex items-center gap-3">
                    <span className="text-slate-400 font-medium text-lg md:text-2xl">{t.searchResults}</span>
                    <span className="text-amber-600">"{sp.search}"</span>
                </span>
            ) : (
                t.title
            )}
          </h1>
          <p className="text-gray-500 font-medium">
            {t.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        
        {/* --- MOBILE CATEGORIES (Horizontal Scroll) --- */}
        <div className="lg:hidden mb-6 -mx-4 px-4 overflow-x-auto scrollbar-hide flex gap-2">
           <Link 
              href={`/${lang}/products`}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                 !sp.category 
                 ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20" 
                 : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
           >
              {t.allCategories}
           </Link>
           {categories.map((cat) => (
              <Link 
                 key={cat.id}
                 href={`/${lang}/products?category=${cat.slug}`}
                 className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                    sp.category === cat.slug 
                    ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20" 
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                 }`}
              >
                 {cat.title}
              </Link>
           ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* --- SIDEBAR (Desktop Only) --- */}
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8 sticky top-24">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
                {t.allCategories}
              </h3>
              <ul className="space-y-1">
                <li>
                  <Link 
                    href={`/${lang}/products`}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                      !sp.category ? "bg-amber-50 text-amber-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span>{t.allCategories}</span>
                    {!sp.category && <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link 
                      href={`/${lang}/products?category=${cat.slug}`}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                        sp.category === cat.slug ? "bg-amber-50 text-amber-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span>{cat.title}</span>
                      {sp.category === cat.slug && <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <CatalogFilters lang={lang as Lang} />
          </aside>

          {/* --- MAIN CONTENT --- */}
          <div className="flex-1 w-full min-w-0">
            
            {/* Top Toolbar (Info + Mobile Filter Trigger) */}
            <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
               
               {/* Левая часть: Счетчик */}
               <div className="text-sm font-bold text-gray-500 order-2 md:order-1">
                  {t.showing} <span className="text-slate-900">{rows.length}</span> {t.products}
               </div>

               {/* Правая часть: Кнопки */}
               <div className="flex items-center gap-2 order-1 md:order-2 w-full md:w-auto justify-between md:justify-end">
                   
                   {/* MOBILE FILTER BUTTON (ШТОРКА) */}
                   <div className="lg:hidden">
                      <MobileFiltersDrawer lang={lang as Lang} activeCount={activeFiltersCount} />
                   </div>

                   {/* Кнопка сброса (появляется если есть любой фильтр, включая поиск) */}
                   {hasAnyFilter && (
                     <Link 
                       href={`/${lang}/products`}
                       className="flex items-center gap-2 text-xs font-bold text-rose-500 hover:text-rose-600 bg-rose-50 px-3 py-2.5 rounded-xl transition-colors h-10 md:h-auto"
                     >
                       <FilterX size={16} />
                       {t.reset}
                     </Link>
                   )}
               </div>
            </div>

            {/* Grid */}
            {rows.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {rows.map((product) => (
                  <ProductCard key={product.id} product={product} lang={lang as Lang} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                   {sp.search ? <Search size={32} /> : <FilterX size={32} />}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t.empty}</h3>
                {sp.search && (
                    <p className="text-sm text-gray-500 mb-4">
                        По запросу "{sp.search}" ничего не найдено.
                    </p>
                )}
                <Link href={`/${lang}/products`} className="text-amber-600 hover:underline text-sm font-bold">
                  {t.reset}
                </Link>
              </div>
            )}

            {/* --- PAGINATION --- */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2 select-none">
                {currentPage > 1 && (
                    <Link href={createPageUrl(currentPage - 1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:border-amber-500 hover:text-amber-600 transition-colors">
                        <ChevronLeft size={16} />
                    </Link>
                )}
                {paginationRange.map((p, i) => {
                  if (p === '...') return <div key={i} className="w-10 h-10 flex items-center justify-center text-gray-400"><MoreHorizontal size={16} /></div>
                  const isActive = Number(p) === currentPage;
                  return (
                    <Link key={i} href={createPageUrl(p)} className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${isActive ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30 pointer-events-none" : "bg-white border border-gray-200 text-gray-600 hover:border-amber-500 hover:text-amber-600"}`}>
                      {p}
                    </Link>
                  );
                })}
                {currentPage < totalPages && (
                    <Link href={createPageUrl(currentPage + 1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:border-amber-500 hover:text-amber-600 transition-colors">
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