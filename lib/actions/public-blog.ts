import { supabaseAdmin } from "@/lib/supabase/admin";
import { Lang } from "@/lib/data";

export type PublicPost = {
  id: number;
  slug: string;
  cover_image: string | null;
  published_at: string;
  title: string;
  excerpt: string | null;
};

export type PostDetail = PublicPost & {
  content: string | null;
  seo_title: string | null;
  seo_desc: string | null;
};

// 1. Получение списка статей с пагинацией
export async function getPublicPosts(
  lang: Lang,
  page: number = 1
): Promise<{ rows: PublicPost[]; totalCount: number }> {
  const LIMIT = 9;
  const from = (page - 1) * LIMIT;
  const to = from + LIMIT - 1;

  // Запрашиваем только активные посты
  const { data: posts, count, error } = await supabaseAdmin
    .from("posts")
    .select("id, slug, cover_image, published_at", { count: "exact" })
    .eq("is_active", true)
    .order("published_at", { ascending: false })
    .range(from, to);

  if (error || !posts || posts.length === 0) {
    return { rows: [], totalCount: 0 };
  }

  const ids = posts.map((p) => p.id);

  // Подгружаем переводы
  const { data: i18n } = await supabaseAdmin
    .from("post_i18n")
    .select("post_id, title, excerpt")
    .in("post_id", ids)
    .eq("lang", lang);

  const i18nMap = new Map(i18n?.map((i) => [i.post_id, i]));

  // Собираем итоговый массив
  const rows: PublicPost[] = posts.map((p) => {
    const translation = i18nMap.get(p.id);
    return {
      id: p.id,
      slug: p.slug,
      cover_image: p.cover_image,
      published_at: p.published_at,
      title: translation?.title || "No Title",
      excerpt: translation?.excerpt || null,
    };
  });

  return { rows, totalCount: count || 0 };
}

// 2. Получение одной статьи
export async function getPublicPostBySlug(slug: string, lang: Lang): Promise<PostDetail | null> {
  // Получаем сам пост
  const { data: post } = await supabaseAdmin
    .from("posts")
    .select("id, slug, cover_image, published_at")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!post) return null;

  // Получаем перевод
  const { data: translation } = await supabaseAdmin
    .from("post_i18n")
    .select("*")
    .eq("post_id", post.id)
    .eq("lang", lang)
    .single();

  return {
    id: post.id,
    slug: post.slug,
    cover_image: post.cover_image,
    published_at: post.published_at,
    title: translation?.title || "No Title",
    excerpt: translation?.excerpt || null,
    content: translation?.content || null,
    seo_title: translation?.seo_title || null,
    seo_desc: translation?.seo_desc || null,
  };
}