// src/lib/data.ts
export type Lang = "az" | "ru";

type WhyKey = "warranty" | "original" | "shipping" | "installments";

export const siteContent = {
  az: {
    nav: ["Ana Səhifə", "Məhsullar", "İcarə", "Haqqımızda", "Əlaqə"],

    topbar: {
      addressShort: "Bakı şəhəri, Nərimanov r., Əliyar Əliyev küç.",
    },

    header: {
      searchPlaceholder: "Minlərlə məhsul arasında axtarış...",
      favorites: "Seçilənlər",
      cart: "Səbət",
      allCategories: "Bütün Kateqoriyalar",
      phoneLabel: "(055) 267 78 11",
    },

    heroSlides: [
      {
        id: 1,
        image: "https://images.unsplash.com/photo-1599939571322-792a326991f2?w=2000&h=800&fit=crop",
        badge: "Rəsmi Distributor",
        title: "Gizli Tarixi Kəşf Edin",
        desc: "Dünyanın ən qabaqcıl metal detektorları Bakıda. Rəsmi zəmanət və peşəkar təlim.",
        btn: "Məhsullara Bax",
      },
      {
        id: 2,
        image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=2000&h=800&fit=crop",
        badge: "Yeni Gələn",
        title: "Minelab Equinox 900",
        desc: "Su keçirməyən, çox tezlikli texnologiya ilə ən dərin axtarışlar üçün.",
        btn: "İndi Sifariş Ver",
      },
      {
        id: 3,
        image: "https://images.unsplash.com/photo-1515524738708-327f6b0033a7?w=2000&h=800&fit=crop",
        badge: "Xüsusi Təklif",
        title: "XP Deus II FMF",
        desc: "Simsiz texnologiya, yüngül çəki və inanılmaz performans bir arada.",
        btn: "Ətraflı Bax",
      },
    ],

    categories: {
      title: "Kateqoriyalar",
      items: ["Qızıl Axtaranlar", "Sualtı Sistemlər", "Boşluq Detektorları", "Pinpointerlər"],
    },

    sections: {
      best: { title: "Ən çox satılanlar", cta: "Hamısına bax" },
      deals: { title: "Sərfəli təkliflər", cta: "Kampaniyalar" },
      columns: { new: "Yeni modellər", top: "Seçilənlər", rec: "Sizə uyğun" },
      brandsLabel: "Rəsmi Zəmanət",
    },

    videoSection: {
      title: "Video İcmallar",
      videos: [
        { id: 1, title: "Minelab Equinox 900 - Sahə Testi", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80" },
        { id: 2, title: "XP Deus II - Dərinlik Yoxlaması", img: "https://images.unsplash.com/photo-1515524738708-327f6b0033a7?w=800&q=80" },
        { id: 3, title: "Nokta Legend - Tənzimləmələr", img: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80" },
      ],
    },

    whyUs: {
      title: "Niyə Məhz Biz?",
      items: [
        { key: "warranty" as WhyKey, title: "Rəsmi Zəmanət", desc: "Bütün cihazlara 2-3 il zəmanət" },
        { key: "original" as WhyKey, title: "Orijinal Məhsul", desc: "100% Orijinal, yoxlanılmış cihazlar" },
        { key: "shipping" as WhyKey, title: "Pulsuz Çatdırılma", desc: "Bakı və regionlara sürətli çatdırılma" },
        { key: "installments" as WhyKey, title: "Hissə-Hissə Ödəniş", desc: "BirKart və TamKart ilə faizsiz taksit" },
      ],
    },

    brands: {
      label: "Rəsmi Tərəfdaşlar",
      names: ["NOKTA", "MINELAB", "GARRETT", "XP"],
    },

    productCard: {
      freeShipping: "KARGO PULSUZ",
      orderBtn: "Sifariş",
      waText: "Salam, bu məhsulla maraqlanıram:",
    },
    notFound: {
        title: "Siqnal İtirlib (Signal Lost)",
        desc: "Axtardığınız səhifə dərinliklərdə itib və ya mövcud deyil. Koordinatları yoxlayın.",
        placeholder: "Məhsul axtar...",
        home: "Ana Səhifə",
        catalog: "Kataloqa Keç",
    },
    footer: {
      contact: "Əlaqə",
      links: "Keçidlər",
      info: "Məlumat",
      social: "Sosial Media",
      createdBy: "Created by Araz Detector",
      rights: "Bütün hüquqlar qorunur.",
      quickLinks: ["Online Mağaza", "Kampaniyalar", "İkinci Əl Cihazlar", "Video Təlimatlar"],
      infoLinks: ["Haqqımızda", "Blog", "Zəmanət Şərtləri", "Geri Qaytarma"],
      fullAddress: "Bakı şəhəri, Nərimanov r., Əliyar Əliyev küç. 1937, Ev 8",
    },

    contact: {
      hero: {
        title1: "Gəlin danışaq",
        title2: "seçiminiz haqqında",
        desc:
          "Tapşırığınıza uyğun avadanlıq seçməyə kömək edirik: dərinlik, torpaq, büdcə və axtarış formatı. Yazın — tez və dəqiq cavab verək.",
      },

      cards: {
        phone: { title: "Telefon", value: "+994 55 267 78 11", sub: "10:00 — 20:00, hər gün" },
        whatsapp: { title: "WhatsApp", value: "Bizə yazın", sub: "Adətən 5–10 dəqiqəyə cavab veririk" },
        office: { title: "Ofis", value: "Bakı, Nizami küç. 10", sub: "T/M, 2-ci mərtəbə (yaxınlıqda parkinq)" },
      },

      form: {
        kicker: "Əlaqə forması",
        title: "Bizə yazın",
        hint: "Əlaqə məlumatlarını buraxın — zəng edək və ya WhatsApp-da cavab verək.",

        nameLabel: "Ad",
        namePlaceholder: "İvan",
        phoneLabel: "Telefon",
        phonePlaceholder: "+994 ...",
        messageLabel: "Mesaj",
        messagePlaceholder: "Məni bu model maraqlandırır... / Dərinlik üzrə məsləhət...",

        submit: "Göndər",
        sending: "Göndərilir…",
        consent:
          "“Göndər” düyməsinə basmaqla, əlaqə məlumatlarının geri dönüş üçün emalına razılıq verirsiniz.",

        sentTitle: "Göndərildi",
        sentDesc: "Mesajınızı aldıq və tezliklə sizinlə əlaqə saxlayacağıq.",
        sendAgain: "Yenidən göndər",
      },

      map: {
        label: "Məkan",
        title: "Şəhərin mərkəzində ofis",
        route: "Marşrut",
      },

      socials: {
        kicker: "Sosial şəbəkələr",
        title: "Əlaqədəyik",
        desc: "Harada rahatdırsa, oradan yazın — cavab verək.",
        instagram: "Instagram",
        facebook: "Facebook",
        whatsapp: "WhatsApp",
      },

      bottom: {
        title: "Tez. Dəqiq. Məzmunlu.",
        subtitle: "MD BAKU",
      },
    },
  },

  ru: {
    nav: ["Главная", "Продукты", "Аренда", "О нас", "Контакты"],

    topbar: {
      addressShort: "г. Баку, Нараимановский р-н, ул. Алияра Алиева",
    },

    header: {
      searchPlaceholder: "Поиск по тысячам товаров...",
      favorites: "Избранное",
      cart: "Корзина",
      allCategories: "Все категории",
      phoneLabel: "(055) 267 78 11",
    },

    heroSlides: [
      {
        id: 1,
        image: "https://images.unsplash.com/photo-1599939571322-792a326991f2?w=2000&h=800&fit=crop",
        badge: "Официальный дистрибьютор",
        title: "Откройте скрытую историю",
        desc: "Самые передовые металлоискатели в Баку. Официальная гарантия и обучение.",
        btn: "Смотреть товары",
      },
      {
        id: 2,
        image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=2000&h=800&fit=crop",
        badge: "Новинка",
        title: "Minelab Equinox 900",
        desc: "Водозащита и мультичастотная технология для максимальной глубины.",
        btn: "Заказать сейчас",
      },
      {
        id: 3,
        image: "https://images.unsplash.com/photo-1515524738708-327f6b0033a7?w=2000&h=800&fit=crop",
        badge: "Спецпредложение",
        title: "XP Deus II FMF",
        desc: "Беспроводные технологии, лёгкий вес и мощная производительность.",
        btn: "Подробнее",
      },
    ],

    categories: {
      title: "Категории",
      items: ["Золотоискатели", "Подводные системы", "Детекторы пустот", "Пинпоинтеры"],
    },

    sections: {
      best: { title: "Хиты продаж", cta: "Смотреть все" },
      deals: { title: "Выгодные предложения", cta: "Акции" },
      columns: { new: "Новинки", top: "Выбор клиентов", rec: "Рекомендуем" },
      brandsLabel: "Официальная гарантия",
    },

    videoSection: {
      title: "Видео-обзоры",
      videos: [
        { id: 1, title: "Minelab Equinox 900 — полевой тест", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80" },
        { id: 2, title: "XP Deus II — проверка глубины", img: "https://images.unsplash.com/photo-1515524738708-327f6b0033a7?w=800&q=80" },
        { id: 3, title: "Nokta Legend — настройки", img: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80" },
      ],
    },

    whyUs: {
      title: "Почему именно мы?",
      items: [
        { key: "warranty" as WhyKey, title: "Официальная гарантия", desc: "Гарантия 2–3 года на все устройства" },
        { key: "original" as WhyKey, title: "Оригинальная продукция", desc: "100% оригинал, проверенные устройства" },
        { key: "shipping" as WhyKey, title: "Бесплатная доставка", desc: "Быстрая доставка по Баку и регионам" },
        { key: "installments" as WhyKey, title: "Оплата частями", desc: "Рассрочка 0% через BirKart и TamKart" },
      ],
    },

    brands: {
      label: "Официальные партнёры",
      names: ["NOKTA", "MINELAB", "GARRETT", "XP"],
    },

    productCard: {
      freeShipping: "БЕСПЛАТНАЯ ДОСТАВКА",
      orderBtn: "Заказать",
      waText: "Здравствуйте, интересует товар:",
    },
    notFound: {
        title: "Сигнал потерян (Signal Lost)",
        desc: "Страница не найдена или больше не существует. Проверьте адрес.",
        placeholder: "Поиск товара...",
        home: "На главную",
        catalog: "В каталог",
    },
    footer: {
      contact: "Контакты",
      links: "Ссылки",
      info: "Информация",
      social: "Соцсети",
      createdBy: "Created by Araz Detector",
      rights: "Все права защищены.",
      quickLinks: ["Интернет-магазин", "Акции", "Б/У приборы", "Видео-инструкции"],
      infoLinks: ["О нас", "Блог", "Гарантия", "Возврат"],
      fullAddress: "г. Баку, Нараимановский р-н, ул. Алияра Алиева 1937, дом 8",
    },
    contact: {
      hero: {
        title1: "Давайте обсудим",
        title2: "ваш выбор",
        desc:
          "Мы помогаем подобрать оборудование под задачу: глубина, грунт, бюджет и формат поиска. Напишите — ответим быстро и по делу.",
      },

      cards: {
        phone: { title: "Телефон", value: "+994 55 267 78 11", sub: "10:00 — 20:00, без выходных" },
        whatsapp: { title: "WhatsApp", value: "Написать нам", sub: "Отвечаем обычно за 5–10 минут" },
        office: { title: "Офис", value: "Баку, ул. Низами 10", sub: "ТЦ, 2 этаж (парковка рядом)" },
      },

      form: {
        kicker: "Форма связи",
        title: "Напишите нам",
        hint: "Оставьте контакты — перезвоним или ответим в WhatsApp.",

        nameLabel: "Имя",
        namePlaceholder: "Иван",
        phoneLabel: "Телефон",
        phonePlaceholder: "+994 ...",
        messageLabel: "Сообщение",
        messagePlaceholder: "Меня интересует модель... / Подскажите по глубине...",

        submit: "Отправить",
        sending: "Отправка…",
        consent:
          "Нажимая “Отправить”, вы соглашаетесь на обработку контактных данных для обратной связи.",

        sentTitle: "Отправлено",
        sentDesc: "Мы получили сообщение и скоро свяжемся с вами.",
        sendAgain: "Отправить ещё раз",
      },

      map: {
        label: "Локация",
        title: "Офис в центре города",
        route: "Маршрут",
      },

      socials: {
        kicker: "Социальные сети",
        title: "Мы на связи",
        desc: "Напишите там, где удобно — ответим.",
        instagram: "Instagram",
        facebook: "Facebook",
        whatsapp: "WhatsApp",
      },

      bottom: {
        title: "Быстро. Чётко. По делу.",
        subtitle: "MD BAKU",
      },
    },
  },
} as const;