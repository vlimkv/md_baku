import { getPublicCollections, getProductsByCollectionKey, PublicProduct } from "@/lib/actions/public";
import { HeroSlider } from "@/components/home/hero-slider";
import { ProductRail } from "@/components/home/product-rail";
import { Lang } from "@/lib/data";
import { ShieldCheck, Truck, CreditCard, Award, Star } from "lucide-react";
import Image from "next/image";

// --- STATIC CONTENT (Server Side) ---
const CONTENT = {
  ru: {
    whyUs: {
      title: "Почему выбирают нас",
      items: [
        { key: "warranty", title: "Официальная гарантия", desc: "Сервисный центр в Баку" },
        { key: "original", title: "100% Оригинал", desc: "Прямые поставки от производителя" },
        { key: "shipping", title: "Быстрая доставка", desc: "По Баку и регионам Азербайджана" },
        { key: "installments", title: "Выгодная рассрочка", desc: "Birkart, Tamkart и другие" },
      ]
    },
    columns: {
      new: "Новинки",
      top: "Хиты продаж",
      rec: "Рекомендуем"
    },
    brands: {
      label: "Официальный дистрибьютор мировых брендов",
      names: ["MINELAB", "XP METAL DETECTORS", "NOKTA", "GARRETT", "QUEST", "FISHER"]
    }
  },
  az: {
    whyUs: {
      title: "Niyə biz?",
      items: [
        { key: "warranty", title: "Rəsmi Zəmanət", desc: "Bakıda servis mərkəzi" },
        { key: "original", title: "100% Orijinal", desc: "İstehsalçıdan birbaşa təchizat" },
        { key: "shipping", title: "Sürətli Çatdırılma", desc: "Bakı və regionlara" },
        { key: "installments", title: "Sərfəli Taksit", desc: "Birkart, Tamkart və digərləri" },
      ]
    },
    columns: {
      new: "Yenilər",
      top: "Çox satılanlar",
      rec: "Tövsiyə edirik"
    },
    brands: {
      label: "Dünya brendlərinin rəsmi distribyutoru",
      names: ["MINELAB", "XP METAL DETECTORS", "NOKTA", "GARRETT", "QUEST", "FISHER"]
    }
  }
};

type WhyKey = "warranty" | "original" | "shipping" | "installments";

// --- HELPER COMPONENTS ---

function WhyUsSection({
  title,
  items,
}: {
  title: string;
  items: { key: string; title: string; desc: string }[];
}) {
  const iconByKey: Record<string, any> = {
    warranty: ShieldCheck,
    original: Award,
    shipping: Truck,
    installments: CreditCard,
  };

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
            {title}
          </h2>
          <div className="w-16 h-1.5 bg-amber-500 mx-auto rounded-full opacity-80"></div>
        </div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => {
            const Icon = iconByKey[item.key] || Award;
            return (
              <div 
                key={idx} 
                className="group bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-10px_rgba(245,158,11,0.15)] hover:border-amber-100 transition-all duration-300 hover:-translate-y-1 text-center flex flex-col items-center"
              >
                {/* Иконка с градиентом */}
                <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 group-hover:from-amber-100 group-hover:to-orange-100 flex items-center justify-center transition-colors duration-300">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-amber-500 group-hover:scale-110 transition-transform duration-300">
                     <Icon size={28} strokeWidth={2} />
                  </div>
                </div>

                {/* Текст */}
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MiniProduct({ product }: { product: PublicProduct }) {
  return (
    <a href={`/products/${product.slug}`} className="flex gap-4 p-3 hover:bg-gray-50 transition border-b border-gray-50 last:border-0 items-center group cursor-pointer rounded-lg">
      <div className="w-16 h-16 bg-white border border-gray-100 rounded-lg p-1 flex items-center justify-center group-hover:border-amber-400 transition-colors relative">
        {product.image ? (
            <Image src={product.image} width={64} height={64} className="w-full h-full object-contain" alt={product.title} />
        ) : (
            <div className="w-full h-full bg-gray-50 rounded flex items-center justify-center text-[8px] text-gray-400">NO IMG</div>
        )}
      </div>
      <div className="flex-1">
        <h4 className="text-xs font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-amber-600 transition">
          {product.title}
        </h4>
        <div className="flex gap-0.5 text-amber-400 mb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={8} fill="currentColor" />
          ))}
        </div>
        <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-gray-600">
          {product.price} {product.currency}
        </span>
      </div>
    </a>
  );
}

// --- MAIN PAGE ---

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function Home({ params }: Props) {
  const { lang } = await params;
  const currentLang = lang as Lang;
  const t = CONTENT[currentLang] || CONTENT.ru;

  // 1. Получаем список коллекций
  const collections = await getPublicCollections(currentLang);

  // 2. Ищем "Рекомендуемые" для Hero (ключ 'recommend')
  const recommendCol = collections.find(c => c.key === "recommend");
  const heroProducts = recommendCol 
    ? await getProductsByCollectionKey("recommend", currentLang, 5) 
    : [];

  // 3. Загружаем товары для остальных коллекций (Хиты, Новинки и т.д.)
  const otherCollections = collections.filter(c => c.key !== "recommend");
  
  const railsData = await Promise.all(
    otherCollections.map(async (col) => {
      const products = await getProductsByCollectionKey(col.key, currentLang, 10);
      return { ...col, products };
    })
  );

  // 4. Подготовка данных для "3 колонок" (Мини-виджеты)
  // Пытаемся найти товары для "Новинок", "Хитов" и "Рекомендуемых"
  const newProducts = railsData.find(r => r.key === 'new')?.products.slice(0, 3) || [];
  const hitProducts = railsData.find(r => r.key === 'hits')?.products.slice(0, 3) || [];
  const recProducts = heroProducts.slice(0, 3); // Берем из рекомендуемых

  return (
    <main className="bg-white min-h-screen">
      
      {/* 1. HERO SLIDER (Только Recommend) */}
      <HeroSlider products={heroProducts} lang={currentLang} />

      <div className="max-w-7xl mx-auto md:px-4 space-y-16 py-12">
        
        {/* 2. PRODUCT RAILS (Hits, New, Deals...) */}
        <div className="space-y-4 md:space-y-0">
            {railsData.map((rail) => (
            rail.products.length > 0 && (
                <ProductRail 
                    key={rail.key} 
                    title={rail.title} 
                    products={rail.products} 
                    lang={currentLang} 
                    collectionKey={rail.key}
                />
            )
            ))}
        </div>

        {/* 3. WHY US */}
        <div className="px-4 md:px-0">
            <WhyUsSection title={t.whyUs.title} items={t.whyUs.items} />
        </div>

        {/* 4. 3 COLUMNS WIDGETS (Real Data) */}
        {(newProducts.length > 0 || hitProducts.length > 0 || recProducts.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 px-4 md:px-0">
            {[
                { title: t.columns.new, items: newProducts },
                { title: t.columns.top, items: hitProducts },
                { title: t.columns.rec, items: recProducts },
            ].map((col, idx) => (
                col.items.length > 0 && (
                    <div
                    key={idx}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 hover:shadow-xl transition-shadow duration-500"
                    >
                    <h3 className="text-base md:text-xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-4">
                        {col.title}
                    </h3>
                    <div className="space-y-2">
                        {col.items.map((p) => <MiniProduct key={p.id} product={p} />)}
                    </div>
                    </div>
                )
            ))}
            </div>
        )}

        {/* 5. BRANDS */}
        <div className="px-4 md:px-0 pb-12">
            <div className="bg-white border border-gray-100 py-10 md:py-16 text-center rounded-[2.5rem] shadow-sm">
                <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-8 md:mb-12">
                    {t.brands.label}
                </p>
                <div className="flex flex-wrap justify-center gap-10 md:gap-20 opacity-40 hover:opacity-100 transition-opacity duration-700">
                    {t.brands.names.map((b) => (
                    <h2
                        key={b}
                        className="text-2xl md:text-4xl font-black text-gray-800 cursor-default tracking-tighter hover:text-amber-600 transition-colors"
                    >
                        {b}
                    </h2>
                    ))}
                </div>
            </div>
        </div>

      </div>
    </main>
  );
}