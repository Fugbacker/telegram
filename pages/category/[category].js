// pages/category/[category].js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Meta from "@/Components/meta";
import Header from "@/Components/header";
import Scroll from '@/Components/scroll';
import { Footer } from "@/Components/footer";
import LiveSearch from '@/Components/liveSearch';
import style from '../../styles/File.module.css';
import { FaUser } from 'react-icons/fa';
import clientPromise from '@/libs/mongodbClient';
import categoryIconsMap from '@/libs/icons';
import photoChecker from '../../public/images/default.png';
import { categoriesDescriptions } from '@/libs/categoriesDescriptions'
// Карта категорий (убедитесь, что она такая же, как и в других местах)
  const categoriesMap = {
    blogs: "Блоги",
    news: "Новости и СМИ",
    entertainment: "Юмор и развлечения",
    tech: "Технологии",
    economics: "Экономика",
    business: "Бизнес и стартапы",
    crypto: "Криптовалюты",
    travels: "Путешествия",
    marketing: "Маркетинг, PR, реклама",
    psychology: "Психология",
    design: "Дизайн",
    politics: "Политика",
    art: "Искусство",
    law: "Право",
    education: "Образование",
    books: "Книги",
    language: "Лингвистика",
    career: "Карьера",
    edutainment: "Познавательное",
    courses: "Курсы и гайды",
    sport: "Спорт",
    beauty: "Мода и красота",
    medicine: "Медицина",
    health: "Здоровье и Фитнес",
    pics: "Картинки и фото",
    apps: "Софт и приложения",
    video: "Видео и фильмы",
    music: "Музыка",
    games: "Игры",
    food: "Еда и кулинария",
    quotes: "Цитаты",
    handmade: "Рукоделие",
    babies: "Семья и дети",
    nature: "Природа",
    construction: "Интерьер и строительство",
    telegram: "Telegram",
    instagram: "Инстаграм",
    sales: "Продажи",
    transport: "Транспорт",
    religion: "Религия",
    esoterics: "Эзотерика",
    darknet: "Даркнет",
    gambling: "Букмекерство",
    shock: "Шок-контент",
    erotica: "Эротика",
    adult: "Для взрослых",
    other: "Другое"
  }


  const keywordsMap = {
  blogs: ["блог", "блогер", "личный", "дневник"],
  news: ["новости", "сми", "газета", "журнал", "репортаж", "информагентство"],
  entertainment: ["юмор", "мем", "смешно", "развлечение", "прикол", "анекдот"],
  tech: ["технологии", "it", "программирование", "разработка", "код", "софт", "гаджет"],
  economics: ["экономика", "финансы", "рынок", "биржа", "валюта", "инвестиции", "доллар", "рубль", "акции"],
  business: ["бизнес", "стартап", "компания", "предприниматель", "корпорация", "менеджмент"],
  crypto: ["биткоин", "крипта", "crypto", "blockchain", "ethereum", "токен", "nft"],
  travels: ["путешествие", "туризм", "страна", "город", "отпуск", "тур", "отель"],
  marketing: ["маркетинг", "реклама", "smm", "seo", "продвижение", "брендинг"],
  psychology: ["психология", "отношения", "саморазвитие", "тест", "психика"],
  design: ["дизайн", "ui", "ux", "графика", "арт", "иллюстрация", "анимация"],
  politics: ["политика", "госдума", "выборы", "закон", "депутат", "президент"],
  art: ["искусство", "картина", "художник", "музей", "выставка", "театр"],
  law: ["право", "закон", "юрист", "адвокат", "суд", "уголовный", "кодекс"],
  education: ["образование", "учеба", "школа", "университет", "курсы", "лекции"],
  books: ["книга", "литература", "чтение", "роман", "повесть", "рассказ"],
  language: ["язык", "лингвистика", "английский", "русский", "перевод"],
  career: ["карьера", "работа", "резюме", "вакансия", "работодатель", "офис"],
  edutainment: ["познавательное", "факт", "наука", "интересное", "обучение"],
  courses: ["курсы", "гайды", "уроки", "тренинг", "обучение"],
  sport: ["спорт", "футбол", "хоккей", "mma", "бокс", "теннис", "тренировка", "спортзал"],
  beauty: ["мода", "красота", "макияж", "одежда", "стиль", "уход", "косметика"],
  medicine: ["медицина", "здоровье", "болезнь", "врач", "лечение", "симптомы"],
  health: ["здоровье", "фитнес", "питание", "тренировка", "йога", "спортзал"],
  pics: ["картинка", "фото", "обои", "wallpaper", "иллюстрация"],
  apps: ["приложение", "app", "android", "ios", "software", "программа"],
  video: ["видео", "фильм", "кино", "сериал", "youtube", "clip", "ролик"],
  music: ["музыка", "трек", "песня", "dj", "альбом", "гитара", "spotify"],
  games: ["игра", "steam", "ps5", "xbox", "гейминг", "esports", "minecraft"],
  food: ["еда", "рецепт", "кухня", "кулинария", "блюдо", "продукт"],
  quotes: ["цитата", "афоризм", "мудрость", "мысль"],
  handmade: ["рукоделие", "своими руками", "handmade", "вязание", "шитье", "творчество"],
  babies: ["семья", "дети", "малыш", "мама", "папа", "родители", "беременность"],
  nature: ["природа", "животные", "растения", "экология", "пейзаж"],
  construction: ["строительство", "ремонт", "интерьер", "дом", "архитектура"],
  telegram: ["telegram", "tg", "бот", "канал", "чат"],
  instagram: ["instagram", "инстаграм", "reels", "stories"],
  sales: ["продажи", "скидка", "акция", "распродажа", "магазин"],
  transport: ["транспорт", "машина", "авто", "поезд", "авиа", "самолет"],
  religion: ["религия", "церковь", "православие", "ислам", "бог"],
  esoterics: ["эзотерика", "магия", "астрал", "гороскоп", "карты таро"],
  darknet: ["даркнет", "darknet", "аноним", "tor", "deepweb"],
  gambling: ["ставки", "букмекер", "казино", "bet", "лотерея"],
  shock: ["шок", "жесть", "жуткое", "страшное"],
  erotica: ["эротика", "nsfw", "18+", "интим"],
  adult: ["для взрослых", "sex", "порно", "xxx", "nsfw"],
  other: ["разное", "другое", "misc"]
};

export default function CategoryPage({ initialChannels, totalChannels, categoryKey, categoryTitle }) {
  const initchannels = initialChannels && JSON.parse(initialChannels);
  const [channels, setChannels] = useState(initchannels);
  const [page, setPage] = useState(1); // Начинаем с 1, так как первая страница уже загружена
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(totalChannels);
  const categoryDescription = categoriesDescriptions[categoryKey]

  const keywords = `Каталог telegram каналов - ${keywordsMap[categoryKey].map((word) => word)}`;

  // Функция для форматирования чисел
  const formatNumber = (num) => {
    if (num == null || isNaN(num)) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Функция-обработчик ошибки загрузки изображения
  const handleImageError = (e) => {
    // setChannelPhoto("/default.png");
    // Также устанавливаем src для элемента img вручную, чтобы избежать зацикливания
    e.target.src = photoChecker.src;
    // Отключаем обработчик, чтобы не было зацикливания, если default.png тоже не загрузится
    e.target.onerror = null;
  };
  // useEffect для подгрузки данных при изменении страницы
  useEffect(() => {
    // Не запускаем при первой загрузке (page = 1)
    if (page === 1) return;

    const fetchMoreChannels = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/categoryChannels?category=${categoryKey}&page=${page}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setChannels(prevChannels => [...prevChannels, ...data.channels]);
        // setTotal(data.total); // Можно обновлять total, если он может меняться
      } catch (err) {
        console.error("Ошибка подгрузки каналов:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMoreChannels();
  }, [page, categoryKey]); // Зависимости: page и categoryKey

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  // Генерация микроразметки LD+JSON
  const generateSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList", // Более подходящий тип для списка каналов
      "name": `Каталог бесплатных телеграм каналов, чатов и групп в категории ${categoryTitle}`,
      "description": `Список популярных telegram каналов чатов и групп в рубрике ${categoryTitle}`,
      "url": `https://teletype.su/category/${categoryKey}`, // Замените на ваш домен
      // Можно добавить itemListElement с конкретными каналами, если нужно
    };
  };

  return (
    <>
      <Head>
        {/* Используем Head для JSON-LD и других мета-тегов */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateSchema()) }}
          key="category-jsonld"
        />
        {/* Другие мета-теги, если Meta их не покрывает полностью */}
      </Head>

      {/* Meta компонент для остальных мета-тегов */}
      <Meta
        title={`Telegram каналы, чаты, группы рубрики - ${categoryTitle}`}
        description={`Популярные телеграм каналы, группы и чаты в категории ${categoryTitle}.`}
        keywords={keywords}
        canonicalURL={`https://teletype.su/category/${categoryKey}`} // Замените на ваш домен
        robots="index, follow"
        ogUrl={`https://teletype.su/category/${categoryKey}`}
        ogTitle={`Telegram каналы, чаты, группы рубрики - ${categoryTitle}`}
        ogDescrition={`Популярные телеграм каналы, группы и чаты в категории ${categoryTitle}.`}
        twitterTitle={`Telegram каналы, чаты, группы рубрики - ${categoryTitle}`}
        twitterDescription={`Популярные телеграм каналы, группы и чаты в категории ${categoryTitle}.`}
      />

      <Header />

      <main className={style.main}>
        <div className={style.mainContainer}>
          <LiveSearch />
          <h1 className={style.categoryTitle}>Каталог телеграм каналов, чатов и групп в категории {categoryTitle}</h1>
          <div className={style.container}>
          <div
            className={style.categoryDescription}
            dangerouslySetInnerHTML={{ __html: categoryDescription }}
          />
          <div className={style.contentWrapper}>
          {channels.length > 0 ? (
          <>
          <section className={style.categoriesPreviewSection1}>
              <div className={style.categoriesPreviewGrid}>
                  <div  className={style.widget}>
                    <h2 className={style.sectionTitle}>{total} каналов на тему {categoryTitle}</h2>
                    <div className={style.categoryPreviewChannels}>
                      {channels.map((channel) => {
                        // --- Функция для получения URL аватара ---
                        let avatarUrl = photoChecker.src; // Путь к изображению-заглушке
                        if (channel.avatarData) {
                          // Предполагаем, что это JPEG
                          avatarUrl = `data:image/jpeg;base64,${channel.avatarData}`;
                        }
                        return (
                          <div key={channel._id} className={style.previewChannelItem}>
                            {/* --- Добавлен блок с аватаром --- */}
                            <div className={style.previewChannelAvatarContainer}>
                              <Image
                                src={avatarUrl}
                                alt={channel.title}
                                width={80}
                                height={80}
                                className={style.image}
                                onError={handleImageError}
                              />
                            </div>

                            <div className={style.previewChannelInfo}>
                              <Link href={`/channel/${channel.username}`} className={style.previewChannelTitleLink}>
                                {channel.title}
                              </Link>
                              <div className={style.previewChannelSubscribers}>
                                <FaUser /> {formatNumber(channel.subscribers)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {keywordsMap[categoryKey] && (
                        <div className={style.hastagContainer}>
                        <h2 className={style.sectionTitle}>Хештеги категории {categoryTitle}</h2>
                          <div className={style.hashtags}>

                          {keywordsMap[categoryKey].map((word, i) => (
                            <span key={i} className={style.hashtag}>#{word}</span>
                          ))}
                        </div>
                        </div>
                      )}
                    </div>
                  </div>
            </div>
            {channels.length < total && (
              <div className={style.loadMoreContainer}>
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className={style.loadMoreButton}
                >
                  {loading ? 'Загрузка...' : 'Показать ещё'}
                </button>
              </div>
            )}
          </section>

           </>
          ) : (
            <p className={style.noChannelsMessage}>В этой категории пока нет каналов.</p>
          )}
           <aside className={style.sidebar}>
            <section className={style.categoriesListSection}>
              <div className={style.widget}>
                <h2 className={style.sectionTitle}>
                  <Link href={`/`} title="Телеграм каналы">Каталог</Link>
                </h2>
                <ul className={style.categoriesList1}>
                  {/* Убираем неверную попытку отображения иконки здесь */}
                  {Object.entries(categoriesMap).map(([categoryKey, categoryTitle]) => (
                    <li key={categoryKey} className={style.categoryItem1}>
                      <Link href={`/category/${categoryKey}`} className={style.categoryLink}>
                        {/* Добавляем иконку внутри цикла, для каждой категории */}
                        {categoryIconsMap[categoryKey] && (
                          // Обернем иконку в span для стилизации, если нужно
                          <span className={style.catIcon}>
                            {categoryIconsMap[categoryKey]}
                          </span>
                        )}
                        {categoryTitle}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </aside>
        </div>
        </div>
        </div>
      </main>
      <Scroll />
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  const { category: categoryKey } = context.params; // Получаем ключ категории из URL

  // Проверяем, существует ли такая категория
  const categoryTitle = categoriesMap[categoryKey];
  if (!categoryTitle) {
      return {
        notFound: true, // Возвращает 404, если категория не найдена
      };
  }

  let initialChannels = [];
  let totalChannels = 0;

  try {
    const client = await clientPromise;
    const db = client.db('tgstat'); // Укажите имя вашей БД
    const collection = db.collection('channels'); // Укажите имя вашей коллекции

    // Получаем общее количество каналов в категории
    totalChannels = await collection.countDocuments({ category: categoryKey });

    // Получаем первые 10 каналов
    // Используем сортировку, например, по количеству подписчиков (desc) или _id
    const cursor = collection.find({ category: categoryKey })
                             .sort({ subscribers: -1, _id: 1 }) // Сначала по подписчикам, потом по _id
                             .limit(51);
    initialChannels = await cursor.toArray();

    return {
      props: {
        initialChannels:JSON.stringify(initialChannels),
        totalChannels,
        categoryKey,
        categoryTitle,
      },
    };
  } catch (err) {
      return {
        notFound: true, // Возвращает 404, если категория не найдена
      };
  }
}