// pages/index.js
import React from 'react';
import Head from 'next/head'; // Импортируем Head
import Image from 'next/image';
import Link from 'next/link';
import Meta from "@/Components/meta"; // Meta может содержать title, description и т.д., но JSON-LD лучше поместить в Head
import Header from "@/Components/header";
import { Footer } from "@/Components/footer";
import LiveSearch from '@/Components/liveSearch';
import style from '../styles/File.module.css';
import categoryIconsMap from '@/libs/icons';
import Scroll from '@/Components/scroll';
import { FaUser } from 'react-icons/fa';
import clientPromise from '@/libs/mongodbClient';
import { categoriesDescriptions } from '@/libs/categoriesDescriptions'
import photoChecker from '../public/images/default.png';

// --- Карта категорий ---
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




export default function Home({ categoriesData }) {
  const categories = categoriesData && JSON.parse(categoriesData);
  const formatNumber = (num) => {
    if (num == null || isNaN(num)) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const handleImageError = (e) => {
    // Также устанавливаем src для элемента img вручную, чтобы избежать зацикливания
    e.target.src = photoChecker.src;
    // Отключаем обработчик, чтобы не было зацикливания, если default.png тоже не загрузится
    e.target.onerror = null;
  };

  const generateSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "headline": 'Телеграм каналы, группы и чаты | Каталог telegram каналов, чатов и групп',
      "description": 'Список бесплатных телеграм каналов, групп и чатов. Каталог telegram каналов, чатов и групп для поиска по названию или ключевым словам',
      "url": `https://teletype.su`,
      "publisher": {
        "@type": "Organization",
        "name": "teletype",
        "logo": {
          "@type": "ImageObject",
          "url": "https://teletype.su/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://teletype.su`
      },
      "datePublished": new Date().toISOString(),
      "author": {
        "@type": "Person",
        "name": "teleype admin"
      }
    };
  };

  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify(generateSchema())}
      </script>

      <Meta
        title={"Телеграм каналы, группы и чаты | Каталог telegram каналов, чатов и групп"}
        description={"Список бесплатных телеграм каналов, групп и чатов. Каталог telegram каналов, чатов и групп для поиска по названию или ключевым словам"}
        keywords={"telegram каналы, телеграм каналы, телеграм чаты, telegram чаты, телеграм группы, telegram группы, каналы telegram, чаты telegram, группы telegram, каталог telegram каналов, каталог telegram групп, каталог telegram чатов, каталог телеграм каналов, каталог телеграм чатов, каталог телеграм групп, поиск телеграм каналов, поиск телеграм групп, поиск телеграм чатов."}
        canonicalURL={`https://teletype.su/`}
        robots="index, follow"
        ogUrl={`https://teletype.su/`}
        ogTitle={"Телеграм каналы, группы и чаты | Каталог telegram каналов, чатов и групп"}
        ogDescrition={"Список бесплатных телеграм каналов, групп и чатов. Каталог telegram каналов, чатов и групп для поиска по названию или ключевым словам"}
        twitterTitle={"Телеграм каналы, группы и чаты | Каталог telegram каналов, чатов и групп"}
        twitterDescription={"Список бесплатных телеграм каналов, групп и чатов. Каталог telegram каналов, чатов и групп для поиска по названию или ключевым словам"}
      />

      <Header />

      <main className={style.main}>
        <div className={style.mainContainer}>
          <LiveSearch />
          <h1 className={style.indexTitle}>Каталог telegram каналов, чатов и групп</h1>
         <section className={style.categoriesListSection}>
            <h2 className={style.sectionTitle}>Категории</h2>
            <ul className={style.categoriesList}>
              {/* Убираем неверную попытку отображения иконки здесь */}
              {Object.entries(categoriesMap).map(([categoryKey, categoryTitle]) => (
                <li key={categoryKey} className={style.categoryItem}>
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
          </section>

          {/* Превью каналов по категориям */}
          <section className={style.categoriesPreviewSection}>
            <h2 className={style.sectionTitle}>Популярные каналы</h2>
            <div className={style.categoriesPreviewGrid}>
              {categories.map((category) => (
                category.channels.length > 0 && ( // Отображаем только категории с каналами
                  <>
                  <div key={category.key} className={style.categoryPreviewCard}>
                    <div className={style.categoryPreviewHeader}>
                      <h3 className={style.categoryPreviewTitle}>
                        <Link href={`/category/${category.key}`} className={style.categoryPreviewLink}>
                          {category.title}
                        </Link>
                      </h3>
                      <div
                        className={style.categoryDescription}
                        dangerouslySetInnerHTML={{ __html: categoriesDescriptions[category.key] }}
                      />
                    </div>
                    <div className={style.categoryPreviewChannels}>
                      {category.channels.map((channel) => {
                        // --- Функция для получения URL аватара ---
                        let avatarUrl = photoChecker.src; // Путь к изображению-заглушке
                        if (channel.avatarData) {
                          // Предполагаем, что это JPEG
                          avatarUrl = `data:image/jpeg;base64,${channel.avatarData}`;
                        }

                        return (
                          <div key={channel._id} className={style.previewChannelItem}>
                          <Link href={`/channel/${channel.username}`} className={style.previewChannelTitleLink}>

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
                              {channel.title}
                              <div className={style.previewChannelSubscribers}>
                                <FaUser /> {formatNumber(channel.subscribers)}
                              </div>
                            </div>
                             </Link>
                          </div>

                        );
                      })}
                    </div>
                    <div className={style.categoryPreviewFooter}>
                      <Link href={`/category/${category.key}`} className={style.categoryPreviewMoreLink}>
                        Все каналы категории &rarr;
                      </Link>
                    </div>
                  </div>
                  </>
                )
              ))}
            </div>
          </section>
        </div>
      </main>
      <Scroll />
      <Footer />
    </>
  );
}

export async function getServerSideProps() {
  const client = await clientPromise;
  const db = client.db('tgstat');
  const collection = db.collection('channels');


  const categories = {
    blogs: "Блоги",
    news: "Новости и СМИ",
    entertainment: "Юмор и развлечения",
    tech: "Технологии",
    economics: "Экономика",
    business: "Бизнес и стартапы",
    crypto: "Криптовалюты",
    travels: "Путешествия",
  }
  const categoriesWithPreview = [];

  for (const [categoryKey, categoryTitle] of Object.entries(categories)) {
    const pipeline = [
      { $match: { category: categoryKey } },
      { $sample: { size: 9 } },
      {
        $project: {
          avatarData: 1,
          username: 1,
          title: 1,
          subscribers: 1,
        }
      }
    ];

    const cursor = collection.aggregate(pipeline);
    const previewChannels = await cursor.toArray();

    if (previewChannels.length > 0) {
      categoriesWithPreview.push({
        key: categoryKey,
        title: categoryTitle,
        channels: previewChannels
      });
    }
  }


  return {
    props: {
      categoriesData: JSON.stringify(categoriesWithPreview),
    },
  };

}