"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdminOrEditor } from "@/lib/admin/guard";

// --- Types ---
export type AdminPostRow = {
  id: number;
  slug: string;
  is_active: boolean;
  published_at: string;
  cover_image: string | null;
  title_ru?: string;
  title_az?: string;
};

// --- Helpers ---
function slugify(input: string) {
  return input.toLowerCase().trim().replace(/['"]/g, "").replace(/[^a-z0-9\u0400-\u04FF]+/g, "-").replace(/^-+|-+$/g, "");
}

// --- 1. LIST POSTS ---
export async function adminListPosts(q?: string, page: number = 1, limit: number = 20) {
  await requireAdminOrEditor();
  const query = (q ?? "").trim().toLowerCase();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Базовый запрос
  let dbQuery = supabaseAdmin
    .from("posts")
    .select("id, slug, is_active, published_at, cover_image", { count: "exact" })
    .order("created_at", { ascending: false });

  // Если есть поиск
  if (query) {
    const { data: textMatches } = await supabaseAdmin
      .from("post_i18n")
      .select("post_id")
      .ilike("title", `%${query}%`);
    
    const ids = textMatches?.map(x => x.post_id) || [];
    if (ids.length > 0) {
      dbQuery = dbQuery.in("id", ids);
    } else {
      // Если искали, но не нашли - возвращаем пустоту
      return { rows: [], totalCount: 0 };
    }
  }

  const { data: posts, count, error } = await dbQuery.range(from, to);
  if (error) throw new Error(error.message);

  // Подгружаем заголовки
  const ids = posts?.map(p => p.id) || [];
  const { data: i18n } = await supabaseAdmin.from("post_i18n").select("post_id, lang, title").in("post_id", ids);

  const enriched = posts?.map(p => {
    const ru = i18n?.find(t => t.post_id === p.id && t.lang === "ru");
    const az = i18n?.find(t => t.post_id === p.id && t.lang === "az");
    return { ...p, title_ru: ru?.title, title_az: az?.title };
  });

  return { rows: enriched || [], totalCount: count || 0 };
}

// --- 2. CREATE POST ---
export async function adminCreatePost(formData: FormData) {
  await requireAdminOrEditor();

  const titleRu = String(formData.get("title_ru") || "").trim();
  const titleAz = String(formData.get("title_az") || "").trim();
  
  if (!titleRu) throw new Error("Заголовок (RU) обязателен");

  // Slug generation
  let slug = String(formData.get("slug") || "").trim();
  if (!slug) slug = slugify(titleRu);
  
  // Проверка уникальности слага (простая)
  const { data: existing } = await supabaseAdmin.from("posts").select("id").eq("slug", slug).maybeSingle();
  if (existing) slug = `${slug}-${Date.now()}`; // Если занят, добавляем timestamp

  // 1. Создаем пост
  const { data: post, error } = await supabaseAdmin.from("posts").insert({
    slug,
    is_active: false // Сразу не публикуем
  }).select("id").single();

  if (error) throw new Error(error.message);

  // 2. Создаем переводы
  const i18nRows = [];
  if (titleRu) i18nRows.push({ post_id: post.id, lang: "ru", title: titleRu });
  if (titleAz) i18nRows.push({ post_id: post.id, lang: "az", title: titleAz });

  if (i18nRows.length > 0) {
    await supabaseAdmin.from("post_i18n").insert(i18nRows);
  }

  revalidatePath("/admin/blog");
}

// --- 3. DELETE POST ---
export async function adminDeletePost(id: number) {
  await requireAdminOrEditor();
  // Удаляем картинку из Storage (если есть), потом запись
  // (Для краткости пока просто удаление записи, каскад удалит i18n)
  await supabaseAdmin.from("posts").delete().eq("id", id);
  revalidatePath("/admin/blog");
}

// --- 4. TOGGLE ACTIVE ---
export async function adminTogglePostActive(id: number) {
  await requireAdminOrEditor();
  const { data } = await supabaseAdmin.from("posts").select("is_active").eq("id", id).single();
  if (data) {
    await supabaseAdmin.from("posts").update({ is_active: !data.is_active }).eq("id", id);
    revalidatePath("/admin/blog");
  }
}

// --- 5. GET SINGLE POST (Для редактирования) ---
export async function adminGetPost(id: number) {
  await requireAdminOrEditor();

  const [postRes, i18nRes] = await Promise.all([
    supabaseAdmin.from("posts").select("*").eq("id", id).single(),
    supabaseAdmin.from("post_i18n").select("*").eq("post_id", id)
  ]);

  if (postRes.error) return null;

  return {
    post: postRes.data,
    i18n: i18nRes.data || []
  };
}

// --- 6. UPDATE BASE (Slug, Status, Date) ---
export async function adminUpdatePostBase(id: number, formData: FormData) {
  await requireAdminOrEditor();

  const slug = String(formData.get("slug") || "").trim();
  const is_active = formData.get("is_active") === "on";
  
  // Дата публикации (если передана, иначе null или текущая)
  // Для простоты оставим как есть, или можно добавить input type="date"

  const { error } = await supabaseAdmin.from("posts").update({
    slug,
    is_active,
    updated_at: new Date().toISOString()
  }).eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}`);
}

// --- 7. UPDATE TRANSLATIONS (Content, SEO) ---
export async function adminUpsertPostI18n(postId: number, lang: "ru" | "az", formData: FormData) {
  await requireAdminOrEditor();

  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "");
  const excerpt = String(formData.get("excerpt") || "");
  const seo_title = String(formData.get("seo_title") || "");
  const seo_desc = String(formData.get("seo_desc") || "");

  if (!title) throw new Error("Заголовок обязателен");

  const { error } = await supabaseAdmin.from("post_i18n").upsert({
    post_id: postId,
    lang,
    title,
    content, // HTML или текст
    excerpt,
    seo_title: seo_title || null,
    seo_desc: seo_desc || null
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/blog/${postId}`);
}

// --- 8. UPDATE COVER IMAGE ---
export async function adminUpdatePostImage(postId: number, url: string) {
  await requireAdminOrEditor();
  
  const { error } = await supabaseAdmin
    .from("posts")
    .update({ cover_image: url })
    .eq("id", postId);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/blog/${postId}`);
}

// --- 9. DELETE IMAGE (DB + STORAGE) ---
export async function adminDeletePostImage(postId: number, imageUrl: string) {
  await requireAdminOrEditor();

  // 1. Удаляем файл из Storage, если ссылка валидная
  if (imageUrl) {
    try {
      // Пример URL: https://xyz.supabase.co/storage/v1/object/public/blog/123/image.jpg
      // Нам нужен путь после /blog/: 123/image.jpg
      const urlObj = new URL(imageUrl);
      const pathParts = urlObj.pathname.split("/blog/"); // Разбиваем по имени бакета "blog"
      
      if (pathParts[1]) {
        const filePath = decodeURIComponent(pathParts[1]); // Декодируем спецсимволы
        await supabaseAdmin.storage.from("blog").remove([filePath]);
      }
    } catch (e) {
      console.error("Ошибка при парсинге/удалении файла:", e);
      // Не выбрасываем ошибку, чтобы хотя бы очистить поле в БД
    }
  }

  // 2. Очищаем поле в БД
  const { error } = await supabaseAdmin
    .from("posts")
    .update({ cover_image: null })
    .eq("id", postId);

  if (error) throw new Error(error.message);
  
  revalidatePath(`/admin/blog/${postId}`);
}