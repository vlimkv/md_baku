"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdminOrEditor } from "@/lib/admin/guard";

// ---------- TYPES ----------
export type Lang = "ru" | "az" | "en";

export type AdminProductRow = {
  id: number;
  slug: string;
  price: number;
  old_price: number | null;
  currency: string;
  in_stock: boolean;
  is_active: boolean;
  badge: string | null;
  popularity: number;
  created_at: string;
  // 👇 1. ДОБАВЛЯЕМ ЭТО ПОЛЕ
  category_id: number | null; 
  title_ru?: string;
  title_az?: string;
  title_en?: string;
};

export type CollectionRow = {
  id: number;
  key: string;
  title_ru: string;
};

export type ProductI18nRow = {
  product_id: number;
  lang: Lang;
  title: string;
  description: string | null;
  specs: any | null;
  seo_title: string | null;
  seo_desc: string | null;
};

export type ProductMediaRow = {
  id: number;
  product_id: number;
  url: string;
  kind: "image" | "video";
  sort_order: number;
  is_main: boolean;
};

// ---------- HELPERS ----------
function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9\u0400-\u04FF]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Умный генератор слагов (избегает дубликатов)
async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const { data } = await supabaseAdmin.from("products").select("id").eq("slug", slug).maybeSingle();
    if (!data) return slug;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

async function enrichWithTranslations(products: any[]): Promise<AdminProductRow[]> {
  if (!products?.length) return [];
  const ids = products.map((p) => p.id);

  const { data: i18n } = await supabaseAdmin
    .from("product_i18n")
    .select("product_id,lang,title")
    .in("product_id", ids);

  const titleMap = new Map<number, { title_ru?: string; title_az?: string; title_en?: string }>();
  i18n?.forEach((row) => {
    const cur = titleMap.get(row.product_id) ?? {};
    if (row.lang === "ru") cur.title_ru = row.title;
    if (row.lang === "az") cur.title_az = row.title;
    if (row.lang === "en") cur.title_en = row.title;
    titleMap.set(row.product_id, cur);
  });

  return products.map((p) => ({ ...p, ...(titleMap.get(p.id) ?? {}) }));
}

// ---------- READ ACTIONS (Parallel Friendly) ----------

export async function adminGetCollections(): Promise<CollectionRow[]> {
  // Кешировать этот запрос можно, но для админки лучше свежие данные
  const { data } = await supabaseAdmin.from("collections").select("id, key, title_ru").order("sort_order");
  return data || [];
}

export async function adminGetProductData(id: number) {
  await requireAdminOrEditor();
  
  // PARALLEL FETCHING PATTERN
  const [productRes, i18nRes, mediaRes, collectionsRes, productColsRes] = await Promise.all([
    supabaseAdmin.from("products").select("*").eq("id", id).single(),
    supabaseAdmin.from("product_i18n").select("*").eq("product_id", id),
    supabaseAdmin.from("product_media").select("*").eq("product_id", id).order("sort_order"),
    supabaseAdmin.from("collections").select("*").order("sort_order"),
    supabaseAdmin.from("collection_products").select("collection_id").eq("product_id", id)
  ]);

  if (productRes.error) return null;

  return {
    product: productRes.data,
    i18n: i18nRes.data as ProductI18nRow[] || [],
    media: mediaRes.data as ProductMediaRow[] || [],
    collections: collectionsRes.data as CollectionRow[] || [],
    selectedCollectionIds: productColsRes.data?.map(c => c.collection_id) || []
  };
}

export async function adminListProducts(q?: string, page: number = 1, limit: number = 20, categoryId?: string) {
  await requireAdminOrEditor();
  const query = (q ?? "").trim().toLowerCase();
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  const selectFields = "id,slug,price,old_price,currency,in_stock,is_active,badge,popularity,created_at,category_id";

  // --- СЦЕНАРИЙ 1: ПРОСТОЙ СПИСОК (БЕЗ ПОИСКА ТЕКСТА) ---
  if (!query) {
    let dbQuery = supabaseAdmin
      .from("products")
      .select(selectFields, { count: "exact" })
      .order("id", { ascending: false });

    // Если есть категория - фильтруем
    if (categoryId && categoryId !== "all") {
      dbQuery = dbQuery.eq("category_id", Number(categoryId));
    }

    const { data, count, error } = await dbQuery.range(from, to);

    if (error) throw new Error(error.message);
    return { rows: await enrichWithTranslations(data || []), totalCount: count || 0 };
  }

  // --- СЦЕНАРИЙ 2: ПОИСК ПО ТЕКСТУ + ФИЛЬТР ---
  // 1. Ищем совпадения по тексту (Slug и Title)
  const [{ data: textMatches }, { data: slugMatches }] = await Promise.all([
    supabaseAdmin.from("product_i18n").select("product_id").ilike("title", `%${query}%`),
    supabaseAdmin.from("products").select("id").ilike("slug", `%${query}%`)
  ]);

  let allIds = Array.from(new Set([
    ...(textMatches?.map((i) => i.product_id) || []),
    ...(slugMatches?.map((i) => i.id) || [])
  ]));

  // 2. Если выбрана категория, фильтруем найденные ID
  if (categoryId && categoryId !== "all" && allIds.length > 0) {
    const { data: filteredProducts } = await supabaseAdmin
      .from("products")
      .select("id")
      .in("id", allIds)
      .eq("category_id", Number(categoryId));
    
    // Оставляем только те ID, которые совпали по категории
    const allowedIds = new Set(filteredProducts?.map(p => p.id));
    allIds = allIds.filter(id => allowedIds.has(id));
  }

  // 3. Пагинация и сортировка
  allIds.sort((a, b) => b - a);
  const totalCount = allIds.length;
  
  if (totalCount === 0) return { rows: [], totalCount: 0 };

  const pagedIds = allIds.slice(from, to + 1);
  const { data: products } = await supabaseAdmin
    .from("products")
    .select(selectFields)
    .in("id", pagedIds)
    .order("id", { ascending: false });

  return { rows: await enrichWithTranslations(products || []), totalCount };
}

// ---------- WRITE ACTIONS ----------

// Добавляем category_id в создание
export async function adminCreateProduct(form: FormData): Promise<void> {
  await requireAdminOrEditor();

  const titleRu = String(form.get("title_ru") || "").trim();
  const titleAz = String(form.get("title_az") || "").trim();
  
  if (!titleRu && !titleAz) throw new Error("Укажите название");

  // SLUG
  let slug = form.get("slug") 
    ? slugify(String(form.get("slug"))) 
    : slugify(titleRu || titleAz);
  slug = await ensureUniqueSlug(slug);

  // CATEGORY (Обработка)
  const catIdRaw = form.get("category_id");
  const category_id = catIdRaw ? Number(catIdRaw) : null;

  // 1. INSERT PRODUCT
  const { data: product, error } = await supabaseAdmin.from("products").insert({
    slug,
    category_id, // <--- ВСТАВЛЯЕМ КАТЕГОРИЮ
    price: Number(form.get("price") || 0),
    old_price: form.get("old_price") ? Number(form.get("old_price")) : null,
    badge: String(form.get("badge") || "").trim() || null,
    popularity: Number(form.get("popularity") || 0),
    is_active: form.get("is_active") === "on",
    in_stock: form.get("in_stock") === "on",
    currency: "AZN"
  }).select("id").single();

  if (error) throw new Error(error.message);

  // 2. Подготовка связанных данных
  const i18nRows = [];
  if (titleRu) i18nRows.push({ product_id: product.id, lang: "ru", title: titleRu });
  if (titleAz) i18nRows.push({ product_id: product.id, lang: "az", title: titleAz });

  // 3. Коллекции
  const collectionIds: number[] = [];
  const { data: allCols } = await supabaseAdmin.from("collections").select("id, key");
  allCols?.forEach(col => {
    if (form.get(`collection_${col.key}`) === "on") collectionIds.push(col.id);
  });
  const colRows = collectionIds.map(cid => ({ collection_id: cid, product_id: product.id }));

  // 4. Параллельная вставка
  await Promise.all([
    supabaseAdmin.from("product_i18n").insert(i18nRows),
    colRows.length > 0 ? supabaseAdmin.from("collection_products").insert(colRows) : null
  ]);

  revalidatePath("/admin/products");
}

export async function adminUpdateProductBase(productId: number, form: FormData) {
  await requireAdminOrEditor();

  // 1. Получаем ID категории из формы
  const catIdRaw = form.get("category_id");
  // Если строка пустая ("") -> null, иначе число
  const category_id = catIdRaw ? Number(catIdRaw) : null;

  const payload: any = {
    category_id, // <--- ВАЖНО: Добавили это поле в обновление
    price: Number(form.get("price") || 0),
    old_price: form.get("old_price") ? Number(form.get("old_price")) : null,
    badge: String(form.get("badge") || "").trim() || null,
    popularity: Number(form.get("popularity") || 0),
    is_active: form.get("is_active") === "on",
    in_stock: form.get("in_stock") === "on",
  };

  const slugRaw = String(form.get("slug") || "").trim();
  if (slugRaw) {
    payload.slug = slugify(slugRaw);
  }

  const { error } = await supabaseAdmin.from("products").update(payload).eq("id", productId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
}

export async function adminUpsertProductI18n(productId: number, lang: Lang, form: FormData) {
  await requireAdminOrEditor();

  const title = String(form.get("title") || "").trim();
  if (!title) throw new Error("Title is required");

  let specs = null;
  if (form.get("specs")) {
    try { specs = JSON.parse(String(form.get("specs"))); } catch {}
  }

  const { error } = await supabaseAdmin.from("product_i18n").upsert({
    product_id: productId,
    lang,
    title,
    description: String(form.get("description") || "") || null,
    seo_title: String(form.get("seo_title") || "") || null,
    seo_desc: String(form.get("seo_desc") || "") || null,
    specs
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/products/${productId}`);
}

export async function adminSetProductCollections(productId: number, collectionIds: number[]) {
  await requireAdminOrEditor();
  
  // Транзакция не поддерживается напрямую в REST, делаем последовательно
  await supabaseAdmin.from("collection_products").delete().eq("product_id", productId);
  
  if (collectionIds.length > 0) {
    const rows = collectionIds.map(cid => ({ collection_id: cid, product_id: productId }));
    await supabaseAdmin.from("collection_products").insert(rows);
  }
  
  revalidatePath(`/admin/products/${productId}`);
}

// --- MEDIA ACTIONS ---
export async function adminAddProductMedia(productId: number, url: string, kind: "image" | "video") {
  await requireAdminOrEditor();
  const { count } = await supabaseAdmin.from("product_media").select("*", { count: 'exact', head: true }).eq("product_id", productId);
  
  await supabaseAdmin.from("product_media").insert({
    product_id: productId,
    url,
    kind,
    sort_order: (count || 0) + 1,
    is_main: false
  });
  revalidatePath(`/admin/products/${productId}`);
}

export async function adminDeleteProductMedia(mediaId: number, productId: number) {
  await requireAdminOrEditor();

  // 1. Получаем запись из БД, чтобы узнать URL файла
  const { data: media } = await supabaseAdmin
    .from("product_media")
    .select("url")
    .eq("id", mediaId)
    .single();

  if (media && media.url) {
    // 2. Пытаемся извлечь путь к файлу из публичного URL
    // Пример URL: https://xyz.supabase.co/storage/v1/object/public/products/123/file.webp
    // Нам нужен путь: 123/file.webp (относительно бакета "products")
    
    try {
      const urlObj = new URL(media.url);
      const pathParts = urlObj.pathname.split("/products/"); // Разбиваем по имени бакета
      
      if (pathParts.length > 1) {
        const filePath = pathParts[1]; // Получаем "123/file.webp"
        
        // 3. Удаляем файл из Storage
        const { error: storageErr } = await supabaseAdmin.storage
          .from("products")
          .remove([filePath]);
          
        if (storageErr) {
          console.error("Ошибка удаления файла из Storage:", storageErr);
          // Не прерываем выполнение, чтобы удалить запись из БД, даже если файл не удалился (например, если его уже нет)
        }
      }
    } catch (e) {
      console.error("Некорректный URL медиа:", media.url);
    }
  }

  // 4. Удаляем запись из базы данных
  const { error } = await supabaseAdmin.from("product_media").delete().eq("id", mediaId);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/products/${productId}`);
}

export async function adminSetMainMedia(productId: number, mediaId: number) {
  await requireAdminOrEditor();
  await supabaseAdmin.from("product_media").update({ is_main: false }).eq("product_id", productId);
  await supabaseAdmin.from("product_media").update({ is_main: true }).eq("id", mediaId);
  revalidatePath(`/admin/products/${productId}`);
}

// --- SIMPLE TOGGLES ---
export async function adminToggleActive(id: number) {
  await requireAdminOrEditor();
  const { data } = await supabaseAdmin.from("products").select("is_active").eq("id", id).single();
  if (data) {
    await supabaseAdmin.from("products").update({ is_active: !data.is_active }).eq("id", id);
    revalidatePath("/admin/products");
  }
}

export async function adminToggleStock(id: number) {
  await requireAdminOrEditor();
  const { data } = await supabaseAdmin.from("products").select("in_stock").eq("id", id).single();
  if (data) {
    await supabaseAdmin.from("products").update({ in_stock: !data.in_stock }).eq("id", id);
    revalidatePath("/admin/products");
  }
}

export async function adminDeleteProduct(id: number) {
  await requireAdminOrEditor();

  // 1. Сначала чистим Storage (удаляем всю папку с ID товара)
  // В Supabase нет "удаления папки", нужно сначала получить список файлов
  const { data: files } = await supabaseAdmin.storage.from("products").list(String(id));
  
  if (files && files.length > 0) {
    const filesToRemove = files.map((f) => `${id}/${f.name}`);
    await supabaseAdmin.storage.from("products").remove(filesToRemove);
  }

  // 2. Удаляем товар из БД (каскадно удалит media, i18n и т.д.)
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
  
  if (error) throw new Error(error.message);

  revalidatePath("/admin/products");
}