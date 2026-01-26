import { notFound } from "next/navigation";
import type { Lang } from "@/lib/data";
import SiteShell from "@/components/layout/SiteShell";
import { getNavbarCategories } from "@/lib/actions/public";
import { CartProvider } from "@/lib/context/cart-context";
// 👇 1. ИМПОРТИРУЕМ КОРЗИНУ (путь поправь, если он другой)
import { CartDrawer } from "@/components/cart/cart-drawer"; 

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (lang !== "az" && lang !== "ru") notFound();

  const categories = await getNavbarCategories(lang as Lang);

  return (
    <CartProvider>
      <SiteShell 
        lang={lang as Lang} 
        categories={categories}
      >
        {children}
      </SiteShell>
      
      <CartDrawer lang={lang as Lang} />
      
    </CartProvider>
  );
}