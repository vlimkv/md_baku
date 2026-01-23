import { notFound } from "next/navigation";
import type { Lang } from "@/lib/data";
import SiteShell from "@/components/layout/SiteShell";
// Импортируем функцию получения категорий
import { getNavbarCategories } from "@/lib/actions/public";

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // Проверка языка
  if (lang !== "az" && lang !== "ru") notFound();

  // 1. Загружаем категории с сервера (кешируется автоматически)
  const categories = await getNavbarCategories(lang as Lang);

  return (
    <SiteShell 
      lang={lang as Lang} 
      categories={categories} // <--- 2. Передаем данные клиенту
    >
      {children}
    </SiteShell>
  );
}