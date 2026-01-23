import { supabaseAdmin } from "@/lib/supabase/admin";
import { Lang } from "@/lib/data";

// --- TYPES ---

export type CategoryNavT = {
  id: number;
  slug: string;
  title: string;
};

export type PublicProduct = {
  id: number;
  slug: string;
  price: number;
  old_price: number | null;
  currency: string;
  in_stock: boolean;
  badge: string | null;
  title: string;
  image: string | null;
  category_title: string;
};

export type ProductDetail = PublicProduct & {
  description: string | null;
  specs: Record<string, string> | null;
  media: { url: string; kind: 'image' | 'video' }[];
  seo_title: string | null;
  seo_desc: string | null;
  related_products: PublicProduct[];
};

// --- ACTIONS ---

// 1. Получение категорий для меню (Хедер)
export async function getNavbarCategories(lang: Lang): Promise<CategoryNavT[]> {
  const { data: categories } = await supabaseAdmin
    .from("categories")
    .select("id, slug, sort_order")
    .order("sort_order", { ascending: true });

  if (!categories || categories.length === 0) return [];

  const ids = categories.map((c) => c.id);

  const { data: i18n } = await supabaseAdmin
    .from("category_i18n")
    .select("category_id, title")
    .in("category_id", ids)
    .eq("lang", lang);

  const map = new Map<number, string>();
  i18n?.forEach((row) => map.set(row.category_id, row.title));

  return categories.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: map.get(c.id) || "Category",
  }));
}

// 2. Получение списка товаров (Каталог)
export async function getPublicProducts(
  lang: Lang, 
  page: number = 1, 
  categorySlug?: string
): Promise<{ rows: PublicProduct[]; totalCount: number }> {
  const LIMIT = 12;
  const from = (page - 1) * LIMIT;
  const to = from + LIMIT - 1;

  // Базовый запрос
  let query = supabaseAdmin
    .from("products")
    .select("id, slug, price, old_price, currency, in_stock, badge, category_id, popularity", { count: "exact" })
    .eq("is_active", true)
    .order("popularity", { ascending: false })
    .order("id", { ascending: false });

  // Фильтр по категории
  if (categorySlug) {
    const { data: cat } = await supabaseAdmin.from("categories").select("id").eq("slug", categorySlug).single();
    if (cat) {
      query = query.eq("category_id", cat.id);
    } else {
      // Если slug категории неверный, возвращаем пустоту
      return { rows: [], totalCount: 0 };
    }
  }

  const { data: products, count, error } = await query.range(from, to);

  if (error || !products || products.length === 0) {
    return { rows: [], totalCount: 0 };
  }

  const ids = products.map((p) => p.id);
  const categoryIds = Array.from(new Set(products.map(p => p.category_id).filter(Boolean)));

  // Параллельная загрузка зависимостей
  const [i18nRes, mediaRes, catI18nRes] = await Promise.all([
    supabaseAdmin.from("product_i18n").select("product_id, title").in("product_id", ids).eq("lang", lang),
    supabaseAdmin.from("product_media").select("product_id, url").in("product_id", ids).eq("is_main", true),
    supabaseAdmin.from("category_i18n").select("category_id, title").in("category_id", categoryIds as number[]).eq("lang", lang)
  ]);

  const titleMap = new Map(i18nRes.data?.map(i => [i.product_id, i.title]));
  const imageMap = new Map(mediaRes.data?.map(m => [m.product_id, m.url]));
  const categoryMap = new Map(catI18nRes.data?.map(c => [c.category_id, c.title]));

  const rows: PublicProduct[] = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    price: p.price,
    old_price: p.old_price,
    currency: p.currency,
    in_stock: p.in_stock,
    badge: p.badge,
    title: titleMap.get(p.id) || "No Title",
    image: imageMap.get(p.id) || null,
    category_title: categoryMap.get(p.category_id) || (lang === 'ru' ? 'Каталог' : 'Kataloq')
  }));

  return { rows, totalCount: count || 0 };
}

// 3. Получение одного товара (Детальная страница)
export async function getPublicProductBySlug(slug: string, lang: Lang): Promise<ProductDetail | null> {
  // А. Получаем сам товар (ОБЯЗАТЕЛЬНО проверяем is_active)
  const { data: product } = await supabaseAdmin
    .from("products")
    .select("id, slug, price, old_price, currency, in_stock, badge, category_id")
    .eq("slug", slug)
    .eq("is_active", true) 
    .single();

  if (!product) return null;

  // Б. Получаем Slug категории (нужен для корректного поиска похожих товаров)
  let categorySlug: string | undefined = undefined;
  let categoryTitle = lang === 'ru' ? 'Каталог' : 'Kataloq';

  if (product.category_id) {
    // Грузим slug категории и её название
    const [catRow, catI18n] = await Promise.all([
       supabaseAdmin.from("categories").select("slug").eq("id", product.category_id).single(),
       supabaseAdmin.from("category_i18n").select("title").eq("category_id", product.category_id).eq("lang", lang).single()
    ]);
    
    if (catRow.data) categorySlug = catRow.data.slug;
    if (catI18n.data) categoryTitle = catI18n.data.title;
  }

  // В. Загружаем всё остальное параллельно
  const [i18nRes, mediaRes, relatedRes] = await Promise.all([
    // Перевод товара
    supabaseAdmin.from("product_i18n").select("*").eq("product_id", product.id).eq("lang", lang).single(),
    
    // Картинки (сортируем по порядку)
    supabaseAdmin.from("product_media").select("url, kind").eq("product_id", product.id).order("sort_order"),
    
    // Похожие товары (фильтруем по slug категории, который получили выше!)
    categorySlug 
      ? getPublicProducts(lang, 1, categorySlug) 
      : Promise.resolve({ rows: [] })
  ]);

  // Г. Убираем сам товар из списка похожих
  const related = (relatedRes.rows || [])
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  return {
    id: product.id,
    slug: product.slug,
    price: product.price,
    old_price: product.old_price,
    currency: product.currency,
    in_stock: product.in_stock,
    badge: product.badge,
    title: i18nRes.data?.title || "No Title",
    description: i18nRes.data?.description || null,
    specs: i18nRes.data?.specs || null,
    seo_title: i18nRes.data?.seo_title || null,
    seo_desc: i18nRes.data?.seo_desc || null,
    category_title: categoryTitle,
    media: mediaRes.data || [],
    image: mediaRes.data?.[0]?.url || null, // Главное фото для превью
    related_products: related
  };
}