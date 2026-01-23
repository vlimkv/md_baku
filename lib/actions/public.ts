import { supabaseAdmin } from "@/lib/supabase/admin";
import { Lang } from "@/lib/data";

export type CategoryNavT = {
  id: number;
  slug: string;
  title: string;
};

// Функция для получения категорий в хедер
export async function getNavbarCategories(lang: Lang): Promise<CategoryNavT[]> {
  // 1. Получаем сами категории
  const { data: categories } = await supabaseAdmin
    .from("categories")
    .select("id, slug, sort_order")
    .order("sort_order", { ascending: true });

  if (!categories || categories.length === 0) return [];

  const ids = categories.map((c) => c.id);

  // 2. Получаем переводы только для ТЕКУЩЕГО языка
  const { data: i18n } = await supabaseAdmin
    .from("category_i18n")
    .select("category_id, title")
    .in("category_id", ids)
    .eq("lang", lang);

  // 3. Собираем Map для быстрого доступа
  const map = new Map<number, string>();
  i18n?.forEach((row) => map.set(row.category_id, row.title));

  // 4. Формируем итоговый массив
  return categories.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: map.get(c.id) || "Category", // Fallback, если перевода нет
  }));
}