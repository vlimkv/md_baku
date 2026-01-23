"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdminOrEditor } from "@/lib/admin/guard";

// Тип для списка категорий
export type AdminCategoryRow = {
  id: number;
  slug: string;
  title_ru?: string;
  title_az?: string;
  products_count?: number;
};

// 1. Получить все категории (с переводами)
export async function adminListCategories(): Promise<AdminCategoryRow[]> {
  await requireAdminOrEditor();

  // Получаем категории
  const { data: categories, error } = await supabaseAdmin
    .from("categories")
    .select("id, slug, sort_order")
    .order("sort_order", { ascending: true });

  if (error || !categories) return [];

  const ids = categories.map((c) => c.id);

  // Получаем переводы
  const { data: i18n } = await supabaseAdmin
    .from("category_i18n")
    .select("category_id, lang, title")
    .in("category_id", ids);

  // Собираем карту переводов
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

  if (!titleRu) throw new Error("Название на русском обязательно");
  if (!slug) throw new Error("Slug обязателен");

  // Создаем категорию
  const { data: cat, error } = await supabaseAdmin
    .from("categories")
    .insert({ slug })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  // Добавляем переводы
  const i18nRows = [];
  if (titleRu) i18nRows.push({ category_id: cat.id, lang: "ru", title: titleRu });
  if (titleAz) i18nRows.push({ category_id: cat.id, lang: "az", title: titleAz });

  if (i18nRows.length > 0) {
    await supabaseAdmin.from("category_i18n").insert(i18nRows);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products"); // Обновляем и товары, так как там выпадающий список
}

// 3. Удалить категорию
export async function adminDeleteCategory(id: number) {
  await requireAdminOrEditor();
  await supabaseAdmin.from("categories").delete().eq("id", id);
  
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
}