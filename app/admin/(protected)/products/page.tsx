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
import { CategoryManager } from "@/components/admin/category-manager";
import { CategoryFilter } from "@/components/admin/category-filter";
import { 
  ToggleActiveBtn, 
  ToggleStockBtn, 
  DeleteBtn 
} from "@/components/admin/submit-buttons";

// Типы параметров URL
type SP = Promise<{ q?: string; page?: string; category?: string }>;

export default async function ProductsListPage({ searchParams }: { searchParams?: SP }) {
  const sp = (await searchParams) ?? {};
  const q = sp.q ?? "";
  const page = Number(sp.page) || 1;
  const categoryId = sp.category; 
  const LIMIT = 20;

  // 1. Загружаем данные
  const [productsData, collectionsList, categoriesFull] = await Promise.all([
    adminListProducts(q, page, LIMIT, categoryId), 
    adminGetCollections(),
    adminListCategories() 
  ]);

  const { rows, totalCount } = productsData;
  const totalPages = Math.ceil(totalCount / LIMIT);

  // 2. Форматируем категории
  const categoriesForSelect = categoriesFull.map(c => ({
    id: c.id,
    slug: c.slug,
    title: c.title_ru || c.slug
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8 pb-24">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6">
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

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <CategoryFilter categories={categoriesForSelect} />
            <form className="relative flex-1 sm:w-80 group" action="/admin/products" method="get">
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

        {/* --- MANAGEMENT SECTION --- */}
        {/* Здесь убрал Grid, теперь просто вертикальный стек с отступами */}
        <div className="space-y-6">
           
           {/* 1. Создание товара */}
           <ProductCreateForm collections={collectionsList} categories={categoriesForSelect} />
           
           {/* 2. Создание категории (На всю ширину) */}
           <CategoryCreateForm />

           {/* 3. Управление категориями (На всю ширину) */}
           <CategoryManager categories={categoriesFull} />
           
        </div>

        <div className="h-px bg-slate-200 my-8" />

        {/* --- PRODUCTS TABLE --- */}
        <div className="space-y-4">
          
          {/* DESKTOP TABLE */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left table-fixed">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  <th className="px-6 py-4 w-20">ID</th>
                  <th className="px-6 py-4 w-[40%]">Товар</th>
                  <th className="px-6 py-4">Цена</th>
                  <th className="px-6 py-4">Статус</th>
                  <th className="px-6 py-4 text-right">Управление</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 align-top text-xs font-mono text-slate-400">
                        #{r.id}
                    </td>
                    
                    <td className="px-6 py-4 align-top">
                      {r.category_id && (
                        <div className="mb-1.5">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100">
                                {categoriesFull.find(c => c.id === r.category_id)?.title_ru || 'Категория'}
                            </span>
                        </div>
                      )}
                      
                      <div className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
                        {r.title_ru || r.title_az || "Без названия"}
                      </div>
                      
                      <div className="text-[10px] text-slate-400 font-mono mt-1 truncate">
                        {r.slug}
                      </div>
                    </td>

                    <td className="px-6 py-4 align-top">
                      <div className="text-sm font-bold text-slate-900 whitespace-nowrap">{Number(r.price).toFixed(2)} ₼</div>
                      {r.old_price && <div className="text-[10px] text-slate-400 line-through">{Number(r.old_price).toFixed(2)} ₼</div>}
                    </td>
                    
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col items-start gap-2">
                         <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${r.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                            <span className={`text-[10px] font-bold uppercase ${r.is_active ? 'text-emerald-700' : 'text-slate-400'}`}>
                                {r.is_active ? 'Активен' : 'Скрыт'}
                            </span>
                         </div>
                         <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${r.in_stock ? 'border-blue-100 text-blue-600 bg-blue-50' : 'border-rose-100 text-rose-600 bg-rose-50'}`}>
                            {r.in_stock ? 'В наличии' : 'Нет'}
                         </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 align-top text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/products/${r.id}`} className="p-2 rounded-lg text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition-all">
                          <Pencil size={16} />
                        </Link>
                        
                        <div className="flex gap-1 border-l border-slate-100 pl-1 ml-1">
                            <form action={async () => { "use server"; await adminToggleActive(r.id); }}>
                                <ToggleActiveBtn isActive={r.is_active} />
                            </form>
                            <form action={async () => { "use server"; await adminToggleStock(r.id); }}>
                                <ToggleStockBtn inStock={r.in_stock} />
                            </form>
                            <form action={async () => { "use server"; await adminDeleteProduct(r.id); }}>
                                <DeleteBtn />
                            </form>
                        </div>
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
               <div key={r.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3 relative overflow-hidden">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${r.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`} />

                  <div className="pl-3">
                     <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 rounded">#{r.id}</span>
                            {r.category_id && (
                                <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded uppercase border border-indigo-100">
                                    {categoriesFull.find(c => c.id === r.category_id)?.title_ru}
                                </span>
                            )}
                        </div>
                        <div className="text-right">
                            <span className="block text-base font-black text-slate-900">{Number(r.price).toFixed(2)} ₼</span>
                        </div>
                     </div>

                     <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1 pr-2">
                        {r.title_ru || r.title_az || <span className="italic text-slate-400">Без названия</span>}
                     </h3>
                     <div className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">{r.slug}</div>
                  </div>

                  <div className="pl-3 pt-3 mt-auto border-t border-slate-100 flex items-center justify-between gap-2">
                     <Link href={`/admin/products/${r.id}`} className="flex-1 flex items-center justify-center py-2 rounded-lg bg-slate-50 text-slate-600 text-xs font-bold uppercase hover:bg-slate-100 transition">
                        <Pencil size={14} className="mr-2" /> Ред.
                     </Link>

                     <div className="flex gap-1">
                        <form action={async () => { "use server"; await adminToggleActive(r.id); }}>
                            <ToggleActiveBtn isActive={r.is_active} mobile />
                        </form>
                        <form action={async () => { "use server"; await adminToggleStock(r.id); }}>
                            <ToggleStockBtn inStock={r.in_stock} mobile />
                        </form>
                        <form action={async () => { "use server"; await adminDeleteProduct(r.id); }}>
                            <DeleteBtn mobile />
                        </form>
                     </div>
                  </div>
               </div>
             ))}
          </div>

          {rows.length === 0 && (
            <div className="text-center py-20 text-slate-400 bg-white rounded-3xl border border-slate-200 border-dashed">
               <Package size={48} className="mx-auto mb-4 opacity-20" />
               <p className="font-medium">Товары не найдены</p>
               <p className="text-xs mt-1">Попробуйте изменить фильтры или добавить новый товар</p>
            </div>
          )}

          <Pagination totalPages={totalPages} />
        </div>
    </div>
  );
}