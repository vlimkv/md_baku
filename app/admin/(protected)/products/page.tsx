import Link from "next/link";
import { 
  adminDeleteProduct, 
  adminListProducts, 
  adminToggleActive, 
  adminToggleStock,
  adminGetCollections 
} from "@/lib/actions/products";
import { adminListCategories } from "@/lib/actions/categories";
import { 
  Search, Package, Pencil, Trash2, Power, BoxSelect
} from "lucide-react";
import { Pagination } from "@/components/admin/pagination";
import { ProductCreateForm } from "@/components/admin/product-create-form";
import { CategoryCreateForm } from "@/components/admin/category-create-form";
import { 
  ToggleActiveBtn, 
  ToggleStockBtn, 
  DeleteBtn 
} from "@/components/admin/submit-buttons";

// 1. ИМПОРТ ФИЛЬТРА
import { CategoryFilter } from "@/components/admin/category-filter";

// 2. Обновляем типы params
type SP = Promise<{ q?: string; page?: string; category?: string }>;

export default async function ProductsListPage({ searchParams }: { searchParams?: SP }) {
  const sp = (await searchParams) ?? {};
  const q = sp.q ?? "";
  const page = Number(sp.page) || 1;
  const categoryId = sp.category; // Получаем ID категории из URL
  const LIMIT = 20;

  // 3. Передаем categoryId в запрос
  const [productsData, collectionsList, categoriesRaw] = await Promise.all([
    adminListProducts(q, page, LIMIT, categoryId), 
    adminGetCollections(),
    adminListCategories()
  ]);

  const { rows, totalCount } = productsData;
  const totalPages = Math.ceil(totalCount / LIMIT);

  // Форматируем категории для селектов
  const categoriesForSelect = categoriesRaw.map(c => ({
    id: c.id,
    slug: c.slug,
    title: c.title_ru || c.slug
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8 pb-24">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6">
          
          {/* Title */}
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Товары</h1>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-500 ml-1">
              Найдено: <span className="text-amber-600 font-bold">{totalCount}</span>
            </p>
          </div>

          {/* Search & Filter Group */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            
            {/* 4. ФИЛЬТР ПО КАТЕГОРИЯМ */}
            <CategoryFilter categories={categoriesForSelect} />

            <form className="relative flex-1 sm:w-80 group" action="/admin/products" method="get">
              {/* Сохраняем категорию при поиске */}
              {categoryId && <input type="hidden" name="category" value={categoryId} />}
              
              <input type="hidden" name="page" value="1" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-amber-600 transition-colors" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Поиск..."
                className="w-full h-12 pl-11 pr-4 rounded-xl bg-white border border-slate-200 text-sm font-medium focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all shadow-sm appearance-none"
              />
            </form>
          </div>
        </div>

        {/* --- FORMS --- */}
        <div className="space-y-4">
           <ProductCreateForm collections={collectionsList} categories={categoriesForSelect} />
           <CategoryCreateForm />
        </div>

        {/* --- DATA DISPLAY --- */}
        <div className="space-y-4 mt-8">
          
          {/* DESKTOP TABLE */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  <th className="px-6 py-4 w-16">ID</th>
                  <th className="px-6 py-4">Товар</th>
                  <th className="px-6 py-4">Цена</th>
                  <th className="px-6 py-4">Статус</th>
                  <th className="px-6 py-4 text-right">Управление</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">#{r.id}</td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                        {r.title_ru || r.title_az || "Без названия"}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400 font-mono">{r.slug}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900">{Number(r.price).toFixed(2)} ₼</div>
                      {r.old_price && <div className="text-[10px] text-slate-400 line-through">{Number(r.old_price).toFixed(2)} ₼</div>}
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-1.5">
                         <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${r.is_active ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                            {r.is_active ? 'АКТИВЕН' : 'СКРЫТ'}
                         </span>
                         <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${r.in_stock ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                            {r.in_stock ? 'В НАЛИЧИИ' : 'НЕТ'}
                         </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${r.id}`} className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-all">
                          <Pencil size={14} />
                        </Link>
                        
                        <form action={async () => { "use server"; await adminToggleActive(r.id); }}>
                          <ToggleActiveBtn isActive={r.is_active} />
                        </form>
                        <form action={async () => { "use server"; await adminToggleStock(r.id); }}>
                          <ToggleStockBtn inStock={r.in_stock} />
                        </form>
                        
                        <div className="w-px h-4 bg-slate-200 mx-1"></div>
                        
                        <form action={async () => { "use server"; await adminDeleteProduct(r.id); }}>
                          <DeleteBtn />
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="md:hidden grid grid-cols-1 gap-4">
             {rows.map((r) => (
               <div key={r.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4 relative overflow-hidden">
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${r.is_active ? 'bg-emerald-500' : 'bg-slate-200'}`} />

                  <div className="pl-2 flex justify-between items-start">
                     <div>
                        <div className="text-[10px] font-mono text-slate-400 mb-0.5">#{r.id} • {r.slug}</div>
                        <h3 className="text-base font-bold text-slate-900 leading-tight pr-4">
                          {r.title_ru || r.title_az || <span className="italic text-slate-400">Без названия</span>}
                        </h3>
                     </div>
                     <div className="text-right">
                        <span className="block text-lg font-black text-amber-600">{Number(r.price).toFixed(2)} ₼</span>
                        {r.old_price && <span className="text-xs text-slate-400 line-through">{Number(r.old_price).toFixed(2)} ₼</span>}
                     </div>
                  </div>

                  <div className="pl-2 pt-3 mt-auto border-t border-slate-100 grid grid-cols-4 gap-2">
                     <Link href={`/admin/products/${r.id}`} className="flex flex-col items-center justify-center p-2 rounded-xl bg-amber-50 text-amber-700 active:scale-95 transition-transform">
                        <Pencil size={20} />
                        <span className="text-[9px] font-bold mt-1 uppercase">Ред.</span>
                     </Link>

                     <form action={async () => { "use server"; await adminToggleActive(r.id); }} className="w-full">
                        <ToggleActiveBtn isActive={r.is_active} mobile />
                     </form>

                     <form action={async () => { "use server"; await adminToggleStock(r.id); }} className="w-full">
                        <ToggleStockBtn inStock={r.in_stock} mobile />
                     </form>

                     <form action={async () => { "use server"; await adminDeleteProduct(r.id); }} className="w-full">
                        <DeleteBtn mobile />
                     </form>
                  </div>
               </div>
             ))}
          </div>

          {rows.length === 0 && (
            <div className="text-center py-20 text-slate-400">
               <Package size={48} className="mx-auto mb-4 opacity-20" />
               <p className="font-medium">В этой категории нет товаров</p>
            </div>
          )}

          <Pagination totalPages={totalPages} />
        </div>
    </div>
  );
}