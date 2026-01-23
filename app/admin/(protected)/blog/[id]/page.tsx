import Link from "next/link";
import { 
  adminGetPost, 
  adminUpdatePostBase, 
  adminUpsertPostI18n,
  // adminUpdatePostImage — больше не нужен здесь, он внутри компонента
} from "@/lib/actions/blog";
import { 
  ArrowLeft, Globe, Settings, ImageIcon, ChevronDown 
} from "lucide-react";
import { SaveBtn, SaveTranslationBtn } from "@/components/admin/submit-buttons";
import { BlogImageUploader } from "@/components/admin/blog-image-uploader"; // <--- ИМПОРТ

type Props = { params: Promise<{ id: string }> };

export default async function BlogEditPage({ params }: Props) {
  const { id } = await params;
  const postId = Number(id);

  const data = await adminGetPost(postId);

  if (!data || !data.post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <h2 className="text-xl font-bold text-slate-900">Статья не найдена</h2>
        <Link href="/admin/blog" className="mt-4 text-blue-600 hover:underline">Вернуться к списку</Link>
      </div>
    );
  }

  const { post, i18n } = data;
  const i18nMap = new Map(i18n.map((r: any) => [r.lang, r]));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 pb-24">
      
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Link href="/admin/blog" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors bg-white">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Редактирование статьи</h1>
          <p className="text-xs text-slate-500 font-mono">ID: {post.id} • {post.slug}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === LEFT: CONTENT & I18N === */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="flex items-center gap-2 text-slate-400 px-1">
             <Globe size={16} />
             <span className="text-xs font-bold uppercase tracking-wider">Локализация контента</span>
          </div>

          <BlogI18nForm lang="ru" postId={postId} initial={i18nMap.get('ru')} label="Русский" color="border-blue-200 bg-blue-50/30" />
          <BlogI18nForm lang="az" postId={postId} initial={i18nMap.get('az')} label="Azərbaycan" color="border-emerald-200 bg-emerald-50/30" />
        </div>

        {/* === RIGHT: SETTINGS & IMAGE === */}
        <div className="space-y-6">
          
          {/* 1. Общие настройки */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Settings size={16} className="text-slate-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Настройки</span>
            </div>
            
            <form action={async (fd) => { "use server"; await adminUpdatePostBase(postId, fd); }} className="p-5 space-y-5">
               <div className="space-y-2">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Slug (URL)</label>
                 <input name="slug" defaultValue={post.slug} className="w-full h-11 px-4 rounded-xl border border-slate-200 font-mono text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
               </div>

               <label className="relative flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-white transition-all has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50/30">
                  <span className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700">Опубликовано</span>
                    <span className="text-[10px] text-slate-400">Видно на сайте</span>
                  </span>
                  <input name="is_active" type="checkbox" defaultChecked={post.is_active} className="w-5 h-5 accent-blue-600 rounded cursor-pointer" />
               </label>

               <SaveBtn label="Сохранить настройки" />
            </form>
          </div>

          {/* 2. Обложка (НОВЫЙ КОМПОНЕНТ) */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <ImageIcon size={16} className="text-slate-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Обложка</span>
            </div>
            
            <div className="p-5">
               <BlogImageUploader postId={postId} initialImage={post.cover_image} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- Компонент формы перевода ---
function BlogI18nForm({ lang, postId, initial, label, color }: any) {
  return (
    <div className={`rounded-2xl border ${color} overflow-hidden transition-all duration-300`}>
      <details className="group" open={lang === 'ru'}>
        <summary className="px-5 py-4 flex items-center justify-between cursor-pointer bg-white/50 backdrop-blur-sm active:bg-white/80 transition-colors list-none">
           <div className="flex items-center gap-3">
              <span className="text-[10px] bg-white border border-slate-200/60 px-2 py-1 rounded-lg text-slate-500 font-mono font-bold shadow-sm">{lang.toUpperCase()}</span>
              <span className="text-xs font-black uppercase text-slate-700">{label}</span>
           </div>
           <ChevronDown size={16} className="text-slate-400 group-open:rotate-180 transition-transform duration-300" />
        </summary>
        
        <div className="p-5 bg-white border-t border-slate-100/60 animate-in slide-in-from-top-2 duration-200">
           <form action={async (fd) => { "use server"; await adminUpsertPostI18n(postId, lang, fd); }} className="space-y-5">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Заголовок H1</label>
                <input name="title" defaultValue={initial?.title || ""} className="w-full h-12 px-4 border border-slate-200 rounded-xl text-base font-bold text-slate-900 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Краткое описание (Excerpt)</label>
                <textarea name="excerpt" defaultValue={initial?.excerpt || ""} className="w-full p-4 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all min-h-[80px]" placeholder="Краткий текст для карточки..." />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Контент (HTML)</label>
                <textarea name="content" defaultValue={initial?.content || ""} className="w-full p-4 border border-slate-200 rounded-xl text-sm font-mono text-slate-700 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all min-h-[300px]" placeholder="<p>Текст статьи...</p>" />
                <p className="text-[10px] text-slate-400 text-right">Поддерживается HTML разметка</p>
              </div>
              
              <div className="pt-4 border-t border-slate-100 mt-2">
                 <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">SEO (Meta Tags)</div>
                 <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">SEO Title</label>
                        <input name="seo_title" defaultValue={initial?.seo_title || ""} className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs bg-slate-50" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">SEO Description</label>
                        <textarea name="seo_desc" defaultValue={initial?.seo_desc || ""} className="w-full p-3 border border-slate-200 rounded-lg text-xs bg-slate-50 min-h-[60px]" />
                    </div>
                 </div>
              </div>

              <div className="pt-2">
                <SaveTranslationBtn />
              </div>
           </form>
        </div>
      </details>
    </div>
  )
}