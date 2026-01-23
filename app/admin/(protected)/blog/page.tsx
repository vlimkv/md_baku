import Link from "next/link";
import { 
  adminListPosts, 
  adminTogglePostActive, 
  adminDeletePost 
} from "@/lib/actions/blog";
import { 
  Search, PenTool, Calendar, Eye, Trash2, Power, Edit
} from "lucide-react";
import { Pagination } from "@/components/admin/pagination";
import { BlogCreateForm } from "@/components/admin/blog-create-form";
import { ToggleActiveBtn, DeleteBtn } from "@/components/admin/submit-buttons";

type SP = Promise<{ q?: string; page?: string }>;

export default async function BlogListPage({ searchParams }: { searchParams?: SP }) {
  const sp = (await searchParams) ?? {};
  const q = sp.q ?? "";
  const page = Number(sp.page) || 1;
  const LIMIT = 20;

  const { rows, totalCount } = await adminListPosts(q, page, LIMIT);
  const totalPages = Math.ceil(totalCount / LIMIT);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8 pb-24">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <PenTool className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Блог</h1>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-500 ml-1">
              Статей: <span className="text-blue-600 font-bold">{totalCount}</span>
            </p>
          </div>

          <form className="relative w-full md:w-80 group">
            <input type="hidden" name="page" value="1" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Поиск статьи..."
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-white border border-slate-200 text-sm font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm appearance-none"
            />
          </form>
        </div>

        {/* CREATE FORM */}
        <BlogCreateForm />

        {/* LIST */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-[10px] uppercase tracking-widest text-slate-400 font-bold hidden md:table-header-group">
                <tr>
                  <th className="px-6 py-4 w-16">ID</th>
                  <th className="px-6 py-4">Заголовок</th>
                  <th className="px-6 py-4">Дата</th>
                  <th className="px-6 py-4 text-center">Статус</th>
                  <th className="px-6 py-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r.id} className="group hover:bg-slate-50 transition-colors flex flex-col md:table-row relative">
                    <td className="px-6 pt-4 md:py-4 text-xs font-mono text-slate-400">#{r.id}</td>
                    
                    <td className="px-6 py-2 md:py-4">
                      <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {r.title_ru || r.title_az || "Без заголовка"}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{r.slug}</div>
                    </td>

                    <td className="px-6 py-2 md:py-4">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <Calendar size={14} />
                        {new Date(r.published_at).toLocaleDateString("ru-RU")}
                      </div>
                    </td>
                    
                    <td className="px-6 py-2 md:py-4 text-left md:text-center">
                       <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${r.is_active ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                          {r.is_active ? 'Опубликован' : 'Черновик'}
                       </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/blog/${r.id}`} className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all">
                          <Edit size={14} />
                        </Link>
                        
                        <form action={async () => { "use server"; await adminTogglePostActive(r.id); }}>
                          <ToggleActiveBtn isActive={r.is_active} />
                        </form>
                        
                        <div className="w-px h-4 bg-slate-200 mx-1"></div>
                        
                        <form action={async () => { "use server"; await adminDeletePost(r.id); }}>
                          <DeleteBtn />
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {rows.length === 0 && (
                <div className="p-10 text-center text-slate-400">Нет записей</div>
            )}
          </div>

          <Pagination totalPages={totalPages} />
        </div>
    </div>
  );
}