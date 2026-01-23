import { createClient } from "@/lib/supabase/client";

type Lang = "az" | "ru" | "en";

export async function getCollectionProducts(lang: Lang, collectionKey: string) {
  const supabase = createClient();

  // 1) найти коллекцию
  const { data: col, error: colErr } = await supabase
    .from("collections")
    .select("id,key")
    .eq("key", collectionKey)
    .eq("is_active", true)
    .single();

  if (colErr) throw new Error(colErr.message);

  // 2) товары внутри коллекции
  const { data: items, error: itemsErr } = await supabase
    .from("collection_products")
    .select(
      `
      sort_order,
      products:products (
        id, slug, price, badge, is_active,
        product_i18n:product_i18n ( lang, title ),
        product_media:product_media ( url, kind, sort_order, is_main )
      )
    `
    )
    .eq("collection_id", col.id)
    .order("sort_order", { ascending: true });

  if (itemsErr) throw new Error(itemsErr.message);

  // 3) маппинг под твою карточку
  return (items ?? [])
    .map((it: any) => {
      const p = it.products;
      if (!p?.is_active) return null;

      const tr = (p.product_i18n || []).find((x: any) => x.lang === lang)
        ?? (p.product_i18n || [])[0];

      // главное изображение: is_main=true и kind=image
      const media = (p.product_media || []).filter((m: any) => m.kind === "image");
      const main = media.find((m: any) => m.is_main) 
        ?? media.sort((a: any, b: any) => a.sort_order - b.sort_order)[0];

      return {
        id: p.id,
        slug: p.slug,
        title: tr?.title ?? p.slug,
        price: String(p.price),
        image: main?.url ?? "https://via.placeholder.com/400x400?text=No+Image",
        badge: p.badge ?? undefined,
      };
    })
    .filter(Boolean);
}