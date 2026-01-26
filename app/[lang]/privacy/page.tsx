import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ShieldCheck, Lock, Eye, Database, 
  Server, Cookie, UserCheck, Scale, Mail, ChevronLeft 
} from "lucide-react";
import type { Lang } from "@/lib/data";

type Props = {
  params: Promise<{ lang: string }>;
};

// --- КОНТЕНТ (RU/AZ) ---
const CONTENT = {
  ru: {
    metaTitle: "Политика конфиденциальности | MD Baku",
    metaDesc: "Узнайте, как мы собираем, используем и защищаем ваши личные данные.",
    back: "Вернуться на главную",
    header: {
      title: "Политика конфиденциальности",
      subtitle: "Мы серьезно относимся к безопасности ваших данных. Ниже описано, как мы их обрабатываем."
    },
    sections: [
      {
        icon: Database,
        title: "Сбор информации",
        text: "Мы собираем только те данные, которые необходимы для выполнения заказа и связи с клиентом: имя, контактный номер, электронная почта и адрес доставки. Технические данные о посетителях сайта (IP-адрес, тип браузера, файлы cookie) могут регистрироваться автоматически."
      },
      {
        icon: Eye,
        title: "Использование данных",
        text: "Собранные данные используются для следующих целей: подтверждение и доставка заказа, прием платежей, предоставление клиентской поддержки и технической помощи, а также информирование о кампаниях и новинках (только с согласия клиента)."
      },
      {
        icon: Lock,
        title: "Защита информации",
        text: "Все личные данные хранятся на безопасных серверах и не передаются третьим лицам без соответствующего согласия. Данные передаются только партнерам, участвующим в выполнении заказа (курьерские службы, почта и т.д.)."
      },
      {
        icon: Cookie,
        title: "Файлы Cookies",
        text: "Наш сайт использует файлы cookie для улучшения пользовательского опыта. Вы можете отключить их в настройках браузера, однако в этом случае некоторые функции сайта могут работать ограниченно."
      },
      {
        icon: UserCheck,
        title: "Ваши права",
        text: "Вы имеете право исправлять, удалять свои личные данные или ограничивать их обработку. Для этого свяжитесь с нами по электронной почте:",
        action: { label: "detektorbaku@gmail.com", link: "mailto:detektorbaku@gmail.com" }
      },
      {
        icon: Scale,
        title: "Законодательство",
        text: "Данная политика конфиденциальности основана на законодательстве Азербайджанской Республики и регулируется в соответствии с ним."
      }
    ]
  },
  az: {
    metaTitle: "Məxfilik siyasəti | MD Baku",
    metaDesc: "Şəxsi məlumatlarınızın necə toplandığı, istifadə edildiyi və qorunduğu barədə məlumat əldə edin.",
    back: "Ana səhifəyə qayıt",
    header: {
      title: "Məxfilik siyasəti",
      subtitle: "MD Baku müştərilərinin şəxsi məlumatlarının məxfiliyinə ciddi yanaşır."
    },
    sections: [
      {
        icon: Database,
        title: "Toplanan məlumatlar",
        text: "Biz yalnız sifarişin icrası və müştəri ilə əlaqə üçün zəruri olan məlumatları toplayırıq: ad, əlaqə nömrəsi, e-poçt, çatdırılma ünvanı. Sayt ziyarətçiləri haqqında texniki məlumatlar (IP ünvanı, brauzer növü, cookie faylları) avtomatik qeydə alına bilər."
      },
      {
        icon: Eye,
        title: "Məlumatların istifadəsi",
        text: "Toplanmış məlumatlar aşağıdakı məqsədlərlə istifadə olunur: sifarişin təsdiqi və çatdırılması; ödənişin qəbul edilməsi; müştəriyə xidmət və texniki dəstək göstərilməsi; kampaniyalar və yeniliklər barədə məlumatlandırma (yalnız müştərinin razılığı ilə)."
      },
      {
        icon: Lock,
        title: "Məlumatların qorunması",
        text: "Bütün şəxsi məlumatlar təhlükəsiz serverlərdə saxlanılır və üçüncü şəxslərə müvafiq razılıq olmadan ötürülmür. Məlumatlar yalnız sifarişin yerinə yetirilməsi üçün (kuryer xidməti, poçt və s.) müvafiq tərəfdaşlarla paylaşılır."
      },
      {
        icon: Cookie,
        title: "Cookies (Kukilər)",
        text: "Saytımız istifadəçi təcrübəsini yaxşılaşdırmaq üçün kukilərdən istifadə edir. Kukiləri deaktiv etmək mümkündür, lakin bu halda saytın bəzi funksiyaları məhdud işləyə bilər."
      },
      {
        icon: UserCheck,
        title: "Hüquqlarınız",
        text: "Siz şəxsi məlumatlarınızı düzəltmək, silmək və ya məlumatların işlənməsini məhdudlaşdırmaq hüququna maliksiniz. Bunun üçün bizimlə əlaqə saxlayın:",
        action: { label: "detektorbaku@gmail.com", link: "mailto:detektorbaku@gmail.com" }
      },
      {
        icon: Scale,
        title: "Qanunvericilik",
        text: "Bu gizlilik siyasəti Azərbaycan Respublikasının qanunvericiliyinə əsaslanır və ona uyğun şəkildə tənzimlənir."
      }
    ]
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

export default async function PrivacyPage({ params }: Props) {
  const { lang } = await params;

  if (lang !== "ru" && lang !== "az") notFound();

  const t = CONTENT[lang as Lang];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      
      {/* HEADER SECTION */}
      <div className="bg-white border-b border-gray-200 pt-10 pb-12 md:pt-16 md:pb-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl mb-6 shadow-sm">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            {t.header.title}
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
            {t.header.subtitle}
          </p>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="max-w-4xl mx-auto px-4 -mt-8">
        <div className="grid gap-6 md:gap-8">
          {t.sections.map((section, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-3xl border border-gray-100 p-6 md:p-10 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                
                {/* ICON */}
                <div className="shrink-0 w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                  <section.icon size={24} />
                </div>

                {/* TEXT */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {section.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                    {section.text}
                  </p>
                  
                  {/* ACTION LINK (Optional) */}
                  {section.action && (
                    <a 
                      href={section.action.link} 
                      className="inline-flex items-center gap-2 mt-4 text-amber-600 font-bold hover:text-amber-700 transition-colors bg-amber-50 px-4 py-2 rounded-xl text-sm"
                    >
                      <Mail size={16} />
                      {section.action.label}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM ACTION */}
        <div className="mt-12 text-center">
          <Link 
            href={`/${lang}`}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold transition-colors text-sm"
          >
            <ChevronLeft size={16} />
            {t.back}
          </Link>
        </div>
      </div>
    </div>
  );
}