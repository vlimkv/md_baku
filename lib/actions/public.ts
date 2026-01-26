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

// 👇 ОБНОВЛЕННАЯ ФУНКЦИЯ (ДОБАВЛЕН ПОИСК)
export async function getPublicProducts(
  lang: Lang, 
  page: number = 1, 
  filters: {
    categorySlug?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sort?: string; 
    search?: string; // <--- Новое поле
  }
): Promise<{ rows: PublicProduct[]; totalCount: number }> {
  const LIMIT = 12;
  const from = (page - 1) * LIMIT;
  const to = from + LIMIT - 1;

  // Базовый запрос
  let query = supabaseAdmin
    .from("products")
    .select("id, slug, price, old_price, currency, in_stock, badge, category_id, popularity, created_at", { count: "exact" })
    .eq("is_active", true);

  // 1. ПОИСК (Самый приоритетный фильтр)
  if (filters.search && filters.search.trim().length > 0) {
    // Ищем в таблице переводов совпадения по названию
    const { data: foundIds } = await supabaseAdmin
      .from("product_i18n")
      .select("product_id")
      .ilike("title", `%${filters.search}%`); // ilike = регистронезависимый поиск

    if (foundIds && foundIds.length > 0) {
      const ids = foundIds.map(f => f.product_id);
      query = query.in("id", ids);
    } else {
      // Если искали, но ничего не нашли — сразу возвращаем пустоту
      return { rows: [], totalCount: 0 };
    }
  }

  // 2. Фильтр по категории
  if (filters.categorySlug) {
    const { data: cat } = await supabaseAdmin.from("categories").select("id").eq("slug", filters.categorySlug).single();
    if (cat) {
      query = query.eq("category_id", cat.id);
    } else {
      return { rows: [], totalCount: 0 };
    }
  }

  // 3. Фильтр по цене
  if (filters.minPrice !== undefined) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice !== undefined) query = query.lte("price", filters.maxPrice);

  // 4. Фильтр по наличию
  if (filters.inStock) query = query.eq("in_stock", true);

  // 5. Сортировка
  switch (filters.sort) {
    case "price_asc": query = query.order("price", { ascending: true }); break;
    case "price_desc": query = query.order("price", { ascending: false }); break;
    case "new": query = query.order("created_at", { ascending: false }); break;
    case "popular":
    default: query = query.order("popularity", { ascending: false }); break;
  }
  
  query = query.order("id", { ascending: false });

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

// 3. Получение одного товара (без изменений)
export async function getPublicProductBySlug(slug: string, lang: Lang): Promise<ProductDetail | null> {
  const { data: product } = await supabaseAdmin
    .from("products")
    .select("id, slug, price, old_price, currency, in_stock, badge, category_id")
    .eq("slug", slug)
    .eq("is_active", true) 
    .single();

  if (!product) return null;

  let categorySlug: string | undefined = undefined;
  let categoryTitle = lang === 'ru' ? 'Каталог' : 'Kataloq';

  if (product.category_id) {
    const [catRow, catI18n] = await Promise.all([
       supabaseAdmin.from("categories").select("slug").eq("id", product.category_id).single(),
       supabaseAdmin.from("category_i18n").select("title").eq("category_id", product.category_id).eq("lang", lang).single()
    ]);
    if (catRow.data) categorySlug = catRow.data.slug;
    if (catI18n.data) categoryTitle = catI18n.data.title;
  }

  const [i18nRes, mediaRes, relatedRes] = await Promise.all([
    supabaseAdmin.from("product_i18n").select("*").eq("product_id", product.id).eq("lang", lang).single(),
    supabaseAdmin.from("product_media").select("url, kind").eq("product_id", product.id).order("sort_order"),
    categorySlug 
      ? getPublicProducts(lang, 1, { categorySlug }) 
      : Promise.resolve({ rows: [] })
  ]);

  const related = (relatedRes.rows || []).filter(p => p.id !== product.id).slice(0, 4);

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
    image: mediaRes.data?.[0]?.url || null,
    related_products: related
  };
}

// --- НОВЫЕ ФУНКЦИИ ДЛЯ КОЛЛЕКЦИЙ ---

// 1. Получить список активных коллекций (чтобы знать их заголовки)
export async function getPublicCollections(lang: Lang): Promise<{ key: string; title: string }[]> {
  const { data } = await supabaseAdmin
    .from("collections")
    .select("key, title_ru, title_az, title_en")
    .eq("is_active", true)
    .order("sort_order");

  if (!data) return [];

  return data.map((col) => ({
    key: col.key,
    title: lang === "ru" ? col.title_ru : (lang === "az" ? col.title_az : col.title_en) || col.title_ru,
  }));
}

// 2. Получить товары конкретной коллекции по её ключу (hits, new, recommend...)
export async function getProductsByCollectionKey(
  key: string,
  lang: Lang,
  limit: number = 10
): Promise<PublicProduct[]> {
  // А. Находим ID коллекции по ключу
  const { data: collection } = await supabaseAdmin
    .from("collections")
    .select("id")
    .eq("key", key)
    .single();

  if (!collection) return [];

  // Б. Получаем товары, связанные с этой коллекцией
  const { data: relations } = await supabaseAdmin
    .from("collection_products")
    .select("product_id")
    .eq("collection_id", collection.id);

  if (!relations || relations.length === 0) return [];

  const productIds = relations.map((r) => r.product_id);

  // В. Загружаем сами товары (аналогично getPublicProducts, но по списку ID)
  const { data: products } = await supabaseAdmin
    .from("products")
    .select("id, slug, price, old_price, currency, in_stock, badge, category_id")
    .in("id", productIds)
    .eq("is_active", true)
    .limit(limit);

  if (!products || products.length === 0) return [];

  // Г. Подгружаем картинки, переводы и категории
  const finalIds = products.map((p) => p.id);
  const categoryIds = Array.from(new Set(products.map(p => p.category_id).filter(Boolean)));

  const [i18nRes, mediaRes, catI18nRes] = await Promise.all([
    supabaseAdmin.from("product_i18n").select("product_id, title").in("product_id", finalIds).eq("lang", lang),
    supabaseAdmin.from("product_media").select("product_id, url").in("product_id", finalIds).eq("is_main", true),
    supabaseAdmin.from("category_i18n").select("category_id, title").in("category_id", categoryIds as number[]).eq("lang", lang)
  ]);

  const titleMap = new Map(i18nRes.data?.map(i => [i.product_id, i.title]));
  const imageMap = new Map(mediaRes.data?.map(m => [m.product_id, m.url]));
  const categoryMap = new Map(catI18nRes.data?.map(c => [c.category_id, c.title]));

  return products.map((p) => ({
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
}