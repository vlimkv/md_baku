"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdminOrEditor } from "@/lib/admin/guard";

export type AdminCategoryRow = {
  id: number;
  slug: string;
  title_ru?: string;
  title_az?: string;
  sort_order?: number;
};

// 1. Получить все категории
export async function adminListCategories(): Promise<AdminCategoryRow[]> {
  await requireAdminOrEditor();

  const { data: categories } = await supabaseAdmin
    .from("categories")
    .select("id, slug, sort_order")
    .order("id", { ascending: true }); // Сортируем по ID или sort_order

  if (!categories) return [];

  const ids = categories.map((c) => c.id);

  const { data: i18n } = await supabaseAdmin
    .from("category_i18n")
    .select("category_id, lang, title")
    .in("category_id", ids);

  const map = new Map<number, { title_ru?: string; title_az?: string }>();
  i18n?.forEach((row) => {
    const current = map.get(row.category_id) || {};
    if (row.lang === "ru") current.title_ru = row.title;
    if (row.lang === "az") current.title_az = row.title;
    map.set(row.category_id, current);
  });

  return categories.map((c) => ({
    ...c,
    ...(map.get(c.id) || { title_ru: "Без названия" }),
  }));
}

// 2. Создать категорию
export async function adminCreateCategory(formData: FormData) {
  await requireAdminOrEditor();

  const titleRu = String(formData.get("title_ru") || "").trim();
  const titleAz = String(formData.get("title_az") || "").trim();
  const slug = String(formData.get("slug") || "").trim().toLowerCase();

  if (!titleRu || !slug) throw new Error("Данные не заполнены");

  const { data: cat, error } = await supabaseAdmin
    .from("categories")
    .insert({ slug })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  const i18nRows = [];
  if (titleRu) i18nRows.push({ category_id: cat.id, lang: "ru", title: titleRu });
  if (titleAz) i18nRows.push({ category_id: cat.id, lang: "az", title: titleAz });

  if (i18nRows.length > 0) {
    await supabaseAdmin.from("category_i18n").insert(i18nRows);
  }

  revalidatePath("/admin/products");
}

// 3. Обновить категорию (НОВОЕ)
export async function adminUpdateCategory(id: number, formData: FormData) {
  await requireAdminOrEditor();

  const titleRu = String(formData.get("title_ru") || "").trim();
  const titleAz = String(formData.get("title_az") || "").trim();
  const slug = String(formData.get("slug") || "").trim().toLowerCase();

  // 1. Обновляем slug в основной таблице
  await supabaseAdmin
    .from("categories")
    .update({ slug })
    .eq("id", id);

  // 2. Обновляем переводы (upsert - обновит если есть, создаст если нет)
  const i18nRows = [];
  if (titleRu) i18nRows.push({ category_id: id, lang: "ru", title: titleRu });
  if (titleAz) i18nRows.push({ category_id: id, lang: "az", title: titleAz });

  if (i18nRows.length > 0) {
    // В Supabase upsert требует указания конфликтных колонок (category_id, lang)
    await supabaseAdmin.from("category_i18n").upsert(i18nRows, { onConflict: 'category_id, lang' });
  }

  revalidatePath("/admin/products");
}

// 4. Удалить категорию
export async function adminDeleteCategory(id: number) {
  await requireAdminOrEditor();
  await supabaseAdmin.from("categories").delete().eq("id", id);
  
  revalidatePath("/admin/products");
}