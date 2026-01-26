import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { 
  Award, ShieldCheck, Factory, Tent, MapPin, 
  CheckCircle2, Building2 
} from "lucide-react";
import type { Lang } from "@/lib/data";

type Props = {
  params: Promise<{ lang: string }>;
};

// --- КОНТЕНТ (RU/AZ) ---
const CONTENT = {
  ru: {
    metaTitle: "О нас | MD Baku",
    metaDesc: "Официальный дилер Minelab в Азербайджане. Более 15 лет опыта в сфере металлоискателей и досмотрового оборудования.",
    back: "На главную",
    header: {
      title: "О компании",
      subtitle: "Профессиональные решения для поиска и безопасности с 2008 года."
    },
    intro: {
      years: "15+",
      yearsLabel: "Лет опыта",
      text: "Компания Detector Baku более 15 лет профессионально занимается металлоискателями и оборудованием для обнаружения. За это время мы накопили обширный практический опыт и заслужили доверие как у начинающих, так и у профессиональных пользователей."
    },
    dealer: {
      title: "Официальный дилер Minelab",
      text: "Мы являемся официальным партнером всемирно известного бренда Minelab в Азербайджане. Мы предлагаем исключительно оригинальную продукцию, официальную гарантию и квалифицированную техническую поддержку."
    },
    services: [
      {
        icon: Factory,
        title: "Промышленность",
        text: "Поставляем промышленные металлоискатели для производственных линий и защиты оборудования."
      },
      {
        icon: ShieldCheck,
        title: "Безопасность",
        text: "Охранное и досмотровое оборудование для обеспечения контроля на объектах и охраняемых территориях."
      },
      {
        icon: Tent,
        title: "Туризм и Outdoor",
        text: "Туристическое снаряжение, аксессуары для полевых работ и всё необходимое для комфортного поиска."
      },
    ],
    values: {
      title: "Наши приоритеты",
      text: "Наш приоритет — профессиональный подход, честная консультация и долгосрочное сотрудничество с клиентами. Мы стремимся предоставить комплексное решение для всех, кто занимается поиском и исследованием."
    },
    address: {
      label: "Наш адрес:",
      // Düzəliş edildi:
      text: "Азербайджан, город Баку, Низаминский район, улица Азера Манафова, 31A (бывшая 5)"
    }
  },
  az: {
    metaTitle: "Haqqımızda | MD Baku",
    metaDesc: "Minelab-ın Azərbaycandakı rəsmi dileri. Metal axtarış avadanlıqları sahəsində 15 illik təcrübə.",
    back: "Ana səhifəyə",
    header: {
      title: "Haqqımızda",
      subtitle: "2008-ci ildən bəri metal axtarış və təhlükəsizlik sahəsində peşəkar həllər."
    },
    intro: {
      years: "15+",
      yearsLabel: "İl təcrübə",
      text: "Detector Baku olaraq biz 15 ildən artıqdır metal axtarış avadanlıqları və aşkarlama texnologiyaları sahəsində fəaliyyət göstəririk. Bu illər ərzində həm həvəskar, həm də peşəkar istifadəçilər üçün etibarlı və sınaqdan keçmiş həllər təqdim etmişik."
    },
    dealer: {
      title: "Minelab Rəsmi Dileri",
      text: "Detector Baku dünyaca məşhur Minelab şirkətinin Azərbaycandakı rəsmi dileridir. Müştərilərimizə yalnız orijinal məhsullar, rəsmi zəmanət və peşəkar texniki məsləhət təqdim edirik."
    },
    services: [
      {
        icon: Factory,
        title: "Sənaye Detektorları",
        text: "İstehsalat və emal sənayesi üçün peşəkar metal aşkarlama sistemləri."
      },
      {
        icon: ShieldCheck,
        title: "Təhlükəsizlik",
        text: "Obyektlərin mühafizəsi və nəzarət zonaları üçün aşkarlama sistemləri və təhlükəsizlik avadanlıqları."
      },
      {
        icon: Tent,
        title: "Turizm və Outdoor",
        text: "Metal axtarışı ilə məşğul olanlar üçün turizm avadanlıqları, səhra aksesuarları və komplekt həllər."
      }
    ],
    values: {
      title: "Dəyərlərimiz",
      text: "Bizim üçün əsas dəyər etibarlılıq, dürüst məsləhət və uzunmüddətli əməkdaşlıqdır. Məqsədimiz müştərilərimizin real ehtiyaclarına uyğun düzgün həll təqdim etməkdir."
    },
    address: {
      label: "Ünvanımız:",
      // Düzəliş edildi:
      text: "Azərbaycan, Bakı şəhəri, Nizami rayonu, Azər Manafov küçəsi 31A (keçmiş 5)"
    }
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = CONTENT[lang as Lang] || CONTENT.ru;
  return {
    title: t.metaTitle,
    description: t.metaDesc,
  };
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;

  if (lang !== "ru" && lang !== "az") notFound();

  const t = CONTENT[lang as Lang];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      
      {/* HEADER HERO */}
      <div className="bg-white border-b border-gray-200 pt-10 pb-12 md:pt-20 md:pb-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-widest mb-6">
                <Building2 size={14} /> MD Baku
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6 leading-[1.1]">
              {t.header.title}
            </h1>
            <p className="text-lg md:text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl">
              {t.header.subtitle}
            </p>
          </div>
        </div>
        
        {/* Decorative Element */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 md:-mt-16 relative z-20 space-y-6 md:space-y-8">
        
        {/* --- BLOCK 1: INTRO & DEALER --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Experience Card */}
            <div className="lg:col-span-7 bg-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-xl flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                
                <div className="mb-8">
                    <div className="text-6xl md:text-8xl font-black text-amber-500 tracking-tighter mb-2">
                        {t.intro.years}
                    </div>
                    <div className="text-sm md:text-base font-bold uppercase tracking-widest text-gray-400">
                        {t.intro.yearsLabel}
                    </div>
                </div>
                
                <p className="text-gray-300 text-base md:text-lg leading-relaxed font-medium relative z-10">
                    {t.intro.text}
                </p>
            </div>

            {/* Dealer Card */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-100 p-8 md:p-12 shadow-sm flex flex-col justify-center">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
                    <Award size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">
                    {t.dealer.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                    {t.dealer.text}
                </p>
            </div>
        </div>

        {/* --- BLOCK 2: SERVICES GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.services.map((s, i) => (
                <div key={i} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-slate-900 mb-6 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                        <s.icon size={24} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-3">{s.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{s.text}</p>
                </div>
            ))}
        </div>

        {/* --- BLOCK 3: VALUES & ADDRESS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Values */}
            <div className="bg-amber-50 rounded-3xl border border-amber-100 p-8 md:p-12">
                <h3 className="text-2xl font-black text-amber-900 mb-4 flex items-center gap-3">
                    <CheckCircle2 className="text-amber-600" /> {t.values.title}
                </h3>
                <p className="text-amber-800/80 leading-relaxed font-medium">
                    {t.values.text}
                </p>
            </div>

            {/* Address */}
            <div className="bg-white rounded-3xl border border-gray-200 p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                        <MapPin size={16} /> {t.address.label}
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-slate-900 leading-snug">
                        {t.address.text}
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}