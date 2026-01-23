import Link from "next/link";
import { 
  adminGetProductData,
  adminUpdateProductBase,
  adminUpsertProductI18n,
  adminSetProductCollections,
  adminAddProductMedia,
  adminDeleteProductMedia,
  adminSetMainMedia
} from "@/lib/actions/products";
// ВАЖНО: Добавил импорт категорий
import { adminListCategories } from "@/lib/actions/categories"; 
import { ArrowLeft, Globe, Image as ImageIcon, Layers, Settings, Trash2, CheckCircle2, ChevronDown } from "lucide-react";
import { ProductMediaUploader } from "@/components/admin/product-media-uploader";

// ИМПОРТ НОВЫХ КНОПОК
import { 
  SaveBtn, 
  SaveCollectionsBtn, 
  SaveTranslationBtn, 
  MediaActionBtn 
} from "@/components/admin/submit-buttons";

type Props = { params: Promise<{ id: string }> };

export default async function ProductEditPage({ params }: Props) {
  const { id } = await params;
  const productId = Number(id);

  // ВАЖНО: Загружаем данные товара И список категорий параллельно
  const [data, categoriesList] = await Promise.all([
    adminGetProductData(productId),
    adminListCategories()
  ]);

  if (!data || !data.product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <h2 className="text-xl font-bold text-slate-900">Товар не найден</h2>
        <Link href="/admin/products" className="mt-4 text-amber-600 hover:underline">Вернуться к списку</Link>
      </div>
    );
  }

  const { product, i18n, media, collections, selectedCollectionIds } = data;
  const i18nMap = new Map(i18n.map((r) => [r.lang, r]));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-12 pb-24">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="w-12 h-12 sm:w-10 sm:h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors active:scale-95 bg-white shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Редактирование</h1>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-500 font-mono">#{product.id}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 truncate max-w-[200px] sm:max-w-md">{product.slug}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* --- LEFT COL --- */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          
          {/* Base Info */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Settings size={16} className="text-slate-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Основные настройки</span>
            </div>
            
            <form action={async (fd) => { "use server"; await adminUpdateProductBase(productId, fd); }} className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
               
               {/* 3. ДОБАВИЛ: Выбор Категории */}
               <div className="sm:col-span-2 space-y-2">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Категория</label>
                 <div className="relative">
                    <select 
                      name="category_id" 
                      defaultValue={product.category_id || ""} 
                      key={product.category_id} // 🔥 Чтобы React перерисовал при обновлении
                      className="w-full h-12 pl-4 pr-10 rounded-xl border border-slate-200 font-bold text-sm text-slate-700 bg-slate-50 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none appearance-none transition-all cursor-pointer"
                    >
                      <option value="">-- Без категории --</option>
                      {categoriesList.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.title_ru || cat.title_az || cat.slug}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Slug (URL)</label>
                 <input name="slug" defaultValue={product.slug} className="w-full h-12 px-4 rounded-xl border border-slate-200 font-mono text-sm focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all bg-slate-50 focus:bg-white" />
               </div>
               <div className="space-y-2">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Badge (Ярлык)</label>
                 <input name="badge" defaultValue={product.badge || ""} placeholder="HIT" className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all bg-slate-50 focus:bg-white" />
               </div>
               <div className="space-y-2">
                 <label className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide">Цена (AZN)</label>
                 <input name="price" type="number" step="0.01" defaultValue={product.price} className="w-full h-12 px-4 rounded-xl border border-emerald-200 font-black text-lg text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all bg-emerald-50/30 focus:bg-white" />
               </div>
               <div className="space-y-2">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Старая цена</label>
                 <input name="old_price" type="number" step="0.01" defaultValue={product.old_price || ""} className="w-full h-12 px-4 rounded-xl border border-slate-200 text-slate-500 focus:border-slate-400 focus:ring-4 focus:ring-slate-200 outline-none transition-all bg-slate-50 focus:bg-white" />
               </div>

               <div className="sm:col-span-2 grid grid-cols-2 gap-4 pt-2">
                  <label className="relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-slate-100 bg-white cursor-pointer has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50/50 transition-all active:scale-95">
                    <input name="is_active" type="checkbox" defaultChecked={product.is_active} className="peer sr-only" />
                    <span className="w-3 h-3 rounded-full bg-slate-300 peer-checked:bg-emerald-500 transition-colors"></span>
                    <span className="text-xs font-bold text-slate-600 peer-checked:text-emerald-700 uppercase tracking-wider">Активен</span>
                    <CheckCircle2 size={16} className="absolute top-3 right-3 text-emerald-500 opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </label>
                  
                  <label className="relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-slate-100 bg-white cursor-pointer has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50/50 transition-all active:scale-95">
                    <input name="in_stock" type="checkbox" defaultChecked={product.in_stock} className="peer sr-only" />
                    <span className="w-3 h-3 rounded-full bg-slate-300 peer-checked:bg-blue-500 transition-colors"></span>
                    <span className="text-xs font-bold text-slate-600 peer-checked:text-blue-700 uppercase tracking-wider">В наличии</span>
                    <CheckCircle2 size={16} className="absolute top-3 right-3 text-blue-500 opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </label>
               </div>

               <div className="sm:col-span-2 pt-2">
                 <SaveBtn label="Сохранить изменения" />
               </div>
            </form>
          </div>

          {/* Media Gallery */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500">
                   <ImageIcon size={16} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Галерея</span>
              </div>
              <ProductMediaUploader productId={productId} />
            </div>
            
            <div className="p-5">
              <form action={async (fd) => { "use server"; await adminAddProductMedia(productId, String(fd.get("url")), "image"); }} className="flex gap-2 mb-6">
                 <input name="url" placeholder="Ссылка на фото..." className="flex-1 h-10 px-4 rounded-xl border border-slate-200 text-xs bg-slate-50" />
                 <button className="bg-white border border-slate-200 px-4 rounded-xl text-xs font-bold hover:bg-slate-50">OK</button>
              </form>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {media.map((m) => (
                  <div key={m.id} className={`relative flex flex-col rounded-xl overflow-hidden border ${m.is_main ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200'}`}>
                    <div className="aspect-square bg-slate-100 relative">
                        {m.kind === "video" ? <video src={m.url} className="w-full h-full object-cover" /> : <img src={m.url} alt="" className="w-full h-full object-cover" />}
                        {m.is_main && <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded shadow-sm">MAIN</div>}
                    </div>

                    <div className="bg-white border-t border-slate-100 p-2 flex items-center justify-between gap-2">
                       {!m.is_main ? (
                         <form action={async () => { "use server"; await adminSetMainMedia(productId, m.id); }} className="flex-1">
                           <MediaActionBtn type="main" />
                         </form>
                       ) : (
                         <div className="flex-1 text-center py-1.5 text-[10px] font-bold text-emerald-600 uppercase">Главное</div>
                       )}
                       <form action={async () => { "use server"; await adminDeleteProductMedia(m.id, productId); }}>
                         <MediaActionBtn type="delete" />
                       </form>
                    </div>
                  </div>
                ))}
              </div>
              
              {media.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                    <ImageIcon size={32} className="mb-2 opacity-50" />
                    <p className="text-xs font-medium">Нет изображений</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* --- RIGHT COL --- */}
        <div className="space-y-6 sm:space-y-8">
          
          {/* Collections */}
          <div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 rounded-3xl border border-indigo-100 p-6 shadow-sm">
             <div className="flex items-center gap-2 mb-5 text-indigo-800">
               <Layers size={18} />
               <span className="text-xs font-black uppercase tracking-wider">Секции на главной</span>
             </div>
             <form action={async (fd) => {
                "use server";
                const ids: number[] = [];
                collections.forEach(col => { if(fd.get(`col_${col.key}`) === "on") ids.push(col.id); });
                await adminSetProductCollections(productId, ids);
             }}>
               <div className="space-y-3 mb-6">
                 {collections.map((col) => (
                   <label key={col.id} className="flex items-center justify-between p-3 bg-white/80 hover:bg-white rounded-xl cursor-pointer border border-transparent has-[:checked]:border-indigo-200 has-[:checked]:bg-white transition-all shadow-sm active:scale-[0.98]">
                     <span className="text-xs font-bold text-slate-700">{col.title_ru}</span>
                     <input type="checkbox" name={`col_${col.key}`} defaultChecked={selectedCollectionIds.includes(col.id)} className="w-5 h-5 accent-indigo-600 rounded cursor-pointer" />
                   </label>
                 ))}
               </div>
               <SaveCollectionsBtn />
             </form>
          </div>

          {/* Translations */}
          <div className="space-y-3">
             <div className="flex items-center gap-2 text-slate-400 px-1 mb-2">
               <Globe size={16} />
               <span className="text-xs font-bold uppercase tracking-wider">Локализация</span>
             </div>
             
             <I18nForm lang="ru" productId={productId} initial={i18nMap.get('ru')} label="Русский" color="border-blue-200 bg-blue-50/30" />
             <I18nForm lang="az" productId={productId} initial={i18nMap.get('az')} label="Azərbaycan" color="border-emerald-200 bg-emerald-50/30" />
             <I18nForm lang="en" productId={productId} initial={i18nMap.get('en')} label="English" color="border-slate-200 bg-slate-50/30" />
          </div>

        </div>
      </div>
    </div>
  );
}

function I18nForm({ lang, productId, initial, label, color }: any) {
  return (
    <div className={`rounded-2xl border ${color} overflow-hidden transition-all duration-300`}>
      <details className="group">
        <summary className="px-5 py-4 flex items-center justify-between cursor-pointer bg-white/50 backdrop-blur-sm active:bg-white/80 transition-colors list-none">
           <div className="flex items-center gap-3">
              <span className="text-[10px] bg-white border border-slate-200/60 px-2 py-1 rounded-lg text-slate-500 font-mono font-bold shadow-sm">{lang.toUpperCase()}</span>
              <span className="text-xs font-black uppercase text-slate-700">{label}</span>
           </div>
           <ChevronDown size={16} className="text-slate-400 group-open:rotate-180 transition-transform duration-300" />
        </summary>
        <div className="p-5 bg-white border-t border-slate-100/60 animate-in slide-in-from-top-2 duration-200">
           <form action={async (fd) => { "use server"; await adminUpsertProductI18n(productId, lang, fd); }} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Название</label>
                <input name="title" defaultValue={initial?.title || ""} className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm font-bold bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Описание (HTML)</label>
                <textarea name="description" defaultValue={initial?.description || ""} className="w-full p-4 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all min-h-[120px]" />
              </div>
              
              <div className="pt-2 border-t border-slate-50 mt-2">
                 <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3 text-center">SEO Настройки</div>
                 <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">SEO Title</label>
                        <input name="seo_title" defaultValue={initial?.seo_title || ""} className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs bg-slate-50" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">SEO Desc</label>
                        <textarea name="seo_desc" defaultValue={initial?.seo_desc || ""} className="w-full p-3 border border-slate-200 rounded-lg text-xs bg-slate-50 min-h-[60px]" />
                    </div>
                 </div>
              </div>

              <SaveTranslationBtn />
           </form>
        </div>
      </details>
    </div>
  )
}