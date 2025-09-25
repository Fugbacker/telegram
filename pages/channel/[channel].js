// pages/channel/[channel].js
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Meta from "@/Components/meta";
import Header from "@/Components/header";
import LiveSearch from "@/Components/liveSearch";
import { Footer } from "@/Components/footer";
import SimilarChannels from "@/Components/similarChannels";
import Scroll from "@/Components/scroll";
import axios from "axios";
import style from "../../styles/File.module.css";
import { FaUser, FaCalendar, FaEye, FaShare, FaThumbsUp, FaComment, FaExternalLinkAlt } from "react-icons/fa";
import clientPromise from "@/libs/mongodbClient";
import categoryIconsMap from "@/libs/icons";
import photoChecker from '../../public/images/default.png';

// --- словарь категорий ---
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
  other: "Другое",
};

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

// --- Вспомогательная функция для форматирования описания ---
const FormatDescription = ({ description, className }) => {
  if (!description) return null;
  const parseDescription = (text) => {
    const elements = [];
    let lastIndex = 0;
    const linkRegex = /(@[\w\d_]+|https?:\/\/[^\s]+)/g;
    let match;
    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const textPart = text.substring(lastIndex, match.index);
        const lines = textPart.split('\n').filter(line => line.length > 0);
        if (lines.length > 0) {
          const paragraphContent = lines.map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < lines.length - 1 ? <br /> : null}
            </React.Fragment>
          ));
          elements.push(...paragraphContent);
        }
      }
      const fullMatch = match[0];
      if (fullMatch.startsWith('@')) {
        const username = fullMatch.substring(1);
        elements.push(
          <Link
            key={`link-${elements.length}`}
            href={`https://t.me/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
          >
            {fullMatch}
          </Link>
        );
      } else if (fullMatch.startsWith('http')) {
        elements.push(
          <Link
            key={`link-${elements.length}`}
            href={fullMatch}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
          >
            {fullMatch}
          </Link>
        );
      }
      lastIndex = match.index + fullMatch.length;
      let newLineCount = 0;
      let checkIndex = lastIndex;
      while (checkIndex < text.length && text[checkIndex] === '\n') {
        newLineCount++;
        checkIndex++;
      }
      if (newLineCount >= 2 && checkIndex < text.length) {
        elements.push(<br key={`br-after-${elements.length}`} />);
      }
      lastIndex = checkIndex;
    }
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);
      const lines = remainingText.split('\n').filter(line => line.length > 0);
      if (lines.length > 0) {
        const paragraphContent = lines.map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < lines.length - 1 ? <br /> : null}
          </React.Fragment>
        ));
        elements.push(...paragraphContent);
      }
    }
    const cleanedElements = [];
    for (let i = 0; i < elements.length; i++) {
      if (elements[i]?.type === 'br') {
        let j = i;
        while (j < elements.length && elements[j]?.type === 'br') {
          j++;
        }
        if (j < elements.length) {
          cleanedElements.push(<br key={`cleaned-br-${i}`} />);
        }
        i = j - 1;
      } else {
        cleanedElements.push(elements[i]);
      }
    }
    while (cleanedElements.length > 0 && cleanedElements[cleanedElements.length - 1]?.type === 'br') {
      cleanedElements.pop();
    }
    return cleanedElements;
  };
  return <div>{parseDescription(description)}</div>;
};

// Вспомогательная функция для форматирования текста поста
const FormatPostText = ({ text }) => {
  if (!text) return null;
  const paragraphs = text.split('\n\n');
  return (
    <>
      {paragraphs.map((paragraph, index) => {
        const lines = paragraph.split('\n').map((line, lineIndex) => (
          <React.Fragment key={lineIndex}>
            {line}
            {lineIndex < paragraph.split('\n').length - 1 ? <br /> : null}
          </React.Fragment>
        ));
        return <p key={index}>{lines}</p>;
      })}
    </>
  );
};

export default function ChannelPage({ initialChannel, initialPosts, channelName, similarChannels, category, engCategory, interestingChannels, interestingCategory }) {
  const [channelPhoto, setChannelPhoto] = useState(
    initialChannel.photo || "/default.png"
  );
  const [channelInfo] = useState({
    ...initialChannel,
  });

  // --- Добавлено: состояние для медиа ---
  const [mediaMap, setMediaMap] = useState({});
  const [loadingMedia, setLoadingMedia] = useState(false);

  const keywords = engCategory && keywordsMap[engCategory]
    ? keywordsMap[engCategory].map((word) => word)
    : [];

  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [lastMessageId, setLastMessageId] = useState(
    initialPosts.length ? initialPosts[initialPosts.length - 1].id : 0
  );
  const [formattedDates, setFormattedDates] = useState({});

  const similarChannelData = similarChannels && JSON.parse(similarChannels);
  const intrestingChannelData = interestingChannels && JSON.parse(interestingChannels);

  // Форматируем даты и подгружаем медиа
  useEffect(() => {
    const dates = {};
    posts.forEach(post => {
      dates[post.id] = new Date(post.date).toLocaleString();
    });
    setFormattedDates(dates);

    // Подгружаем медиа, если ещё не загружены
    if (posts.length > 0 && Object.keys(mediaMap).length === 0 && !loadingMedia) {
      setLoadingMedia(true);
      fetch(`/api/getChannels?username=${channelName}&limit=${posts.length}&skip_media=0`)
        .then(res => res.json())
        .then(data => {
          const map = {};
          data.posts.forEach(p => {
            if (p.media) map[p.id] = p.media;
          });
          setMediaMap(map);
          setLoadingMedia(false);
        })
        .catch(err => {
          console.error("Ошибка загрузки медиа:", err);
          setLoadingMedia(false);
        });
    }
  }, [posts, channelName, mediaMap, loadingMedia]);

  const loadMore = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/getChannels?username=${channelName}&limit=10&offset_id=${lastMessageId}&skip_media=1`
      );
      const data = await res.json();
      if (data.posts?.length) {
        setPosts(prev => [...prev, ...data.posts]);
        setLastMessageId(data.posts[data.posts.length - 1].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openInTelegram = (messageId, channelUsername) => {
    const telegramUrl = `https://t.me/${channelUsername}/${messageId}`;
    window.open(telegramUrl, '_blank');
  };

  const formatNumber = (num) => {
    if (num == null || isNaN(num)) {
      return '0';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleImageError = (e) => {
    console.warn(`Ошибка загрузки изображения для канала @${channelName}. Установлено изображение по умолчанию.`);
    setChannelPhoto("/default.png");
    e.target.src = photoChecker.src;
    e.target.onerror = null;
  };

  const generateSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": channelInfo.title,
      "headline": `Телеграм канал - ${channelInfo.title}`,
      "description": `Telegram канал - ${channelInfo.description}`,
      "url": `https://teletype.su/channel/${channelName}`,
      "publisher": {
        "@type": "Organization",
        "name": "teletype.su",
        "logo": {
          "@type": "ImageObject",
          "url": "https://teletype.su/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://teletype.su/channel/${channelName}`
      },
      "datePublished": new Date().toISOString(),
      "author": {
        "@type": "Person",
        "name": "CADMap Team"
      }
    };
  };

  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify(generateSchema())}
      </script>

      <Meta
        title={`Телеграм канал - "${channelInfo.title}"`}
        description={`Telegram канал - "${channelInfo.title}": ${channelInfo.description}`}
        keywords={`"${channelInfo.title}" - ${keywords.join(', ')}`}
        canonicalURL={`https://teletype.su/channel/${channelName}`}
        robots="index, follow"
        ogUrl={`https://teletype.su/channel/${channelName}`}
        ogTitle={`Телеграм канал - ${channelInfo.title}`}
        ogDescrition={`Telegram канал - ${channelInfo.description}`}
        twitterTitle={`Телеграм канал - ${channelInfo.title}`}
        twitterDescription={`Telegram канал - ${channelInfo.description}`}
      />

      <Header />

      <main className={style.main}>
        <div className={style.mainContainer}>
          <LiveSearch />
          <section className={style.channelHeader}>
            <div className={style.headerContent}>
              <div className={style.profileSection}>
                <img
                  src={channelPhoto}
                  alt={channelInfo.title || `Канал ${channelName}`}
                  className={style.profilePhoto}
                  onError={handleImageError}
                />
                <div className={style.profileInfo}>
                  <div className={style.profileInfoContainer}>
                    <h1 className={style.channelTitle}>
                      {channelInfo.title}
                      {channelInfo.verified && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className={style.verifiedIcon}
                        >
                          <path
                            fill="#2AABEE"
                            d="M22.5 12c0 5.8-4.7 10.5-10.5 10.5S1.5 17.8 1.5 12 6.2 1.5 12 1.5 22.5 6.2 22.5 12z"
                          />
                          <path
                            fill="#fff"
                            d="M10.2 15.6l-3.3-3.3 1.1-1.1 2.2 2.2 6-6 1.1 1.1z"
                          />
                        </svg>
                      )}
                    </h1>
                    <div className={style.usernameContainer}>
                      <div className={style.username}>
                        <span>@{channelName}</span>
                      </div>
                      <div className={style.channelType}>
                        {channelInfo.broadcast
                          ? "Канал"
                          : channelInfo.megagroup
                            ? "Супергруппа"
                            : "Группа"}
                      </div>
                      <div className={style.channelType}>
                        <Link href={`/category/${engCategory}`} title={`каталог телеграм каналов - ${category}`}>{category}</Link>
                      </div>
                    </div>
                    <div className={style.stats}>
                      <div className={style.statItem}>
                        <FaUser /> {formatNumber(channelInfo.participantsCount)} подписчиков
                      </div>
                    </div>
                  </div>
                  <div className={style.description}>
                    <FormatDescription
                      description={channelInfo.description}
                      className={style.descriptionLink}
                    />
                    <div className={style.extraInfo}>
                      {channelInfo.linkedChatId && (
                        <div className={style.statItem}>
                          💬 Связанный чат: ID {channelInfo.linkedChatId}
                        </div>
                      )}
                      {channelInfo.location && (
                        <div className={style.statItem}>
                          📍 Гео-чат: {channelInfo.location.address || ""}
                          {channelInfo.location.lat && channelInfo.location.long && (
                            <span> ({channelInfo.location.lat}, {channelInfo.location.long})</span>
                          )}
                        </div>
                      )}
                      {channelInfo.defaultBannedRights && (
                        <div className={style.statItem}>
                          🚫 Ограничения по умолчанию:
                          <pre>{JSON.stringify(channelInfo.defaultBannedRights, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className={style.container}>
            <div className={style.contentWrapper}>
              <article className={style.mainContent}>
                <div className={style.postsContainer}>
                  {posts.map(post => {
                    const media = mediaMap[post.id] || post.media;
                    return (
                      <div key={post.id} className={style.postCard}>
                        <div className={style.postHeader}>
                          <div className={style.postAuthor}>
                            <img
                              src={channelPhoto}
                              alt={channelInfo.title}
                              className={style.authorAvatar}
                              onError={handleImageError}
                            />
                            <div className={style.authorInfo}>
                              <div className={style.authorName}>{channelInfo.title}</div>
                              <div className={style.postDate} suppressHydrationWarning>
                                <FaCalendar /> {formattedDates[post.id] || new Date(post.date).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className={style.postActions}>
                            <button className={style.postAction}>
                              <FaExternalLinkAlt />
                            </button>
                          </div>
                        </div>
                        <div className={style.postBody}>
                          <div className={style.postText}>
                            <FormatPostText text={post.text} />
                          </div>
                          {media?.type === 'photo' && (
                            media.data ? (
                              <div className={style.mediaContainer}>
                                <img
                                  src={media.data}
                                  alt="Post media"
                                  className={style.postMedia}
                                />
                              </div>
                            ) : (
                              <div className={style.placeholder}>
                                Изображение недоступно
                              </div>
                            )
                          )}
                          {media?.type === 'video' && (
                            media.playable ? (
                              <div className={style.mediaContainer}>
                                <video
                                  controls
                                  poster={media.thumb || undefined}
                                  className={style.postVideo}
                                >
                                  <source
                                    src={`/api/streamVideo?messageId=${post.id}&channel=${channelName}`}
                                    type={media.mimeType || "video/mp4"}
                                  />
                                  Ваш браузер не поддерживает видео.
                                </video>
                              </div>
                            ) : (
                              <div
                                className={style.videoPlaceholder}
                                onClick={() => openInTelegram(post.id, channelName)}
                              >
                                {media.thumb ? (
                                  <img src={media.thumb} alt="Video thumbnail" />
                                ) : (
                                  <div className={style.videoPlaceholderText}>
                                    Смотреть видео в Telegram
                                  </div>
                                )}
                                <div className={style.overlay}>
                                  <span>▶</span>
                                  <p>Смотреть в Telegram</p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                        <div className={style.postStats}>
                          <div className={style.statItem}>
                            <FaEye /> {formatNumber(post.stats.views)} просмотров
                          </div>
                          <div className={style.statItem}>
                            <FaShare /> {formatNumber(post.stats.forwards)} репостов
                          </div>
                          {post.stats.reactions && post.stats.reactions.length > 0 && (
                            <div className={style.statItem}>
                              <FaThumbsUp /> {post.stats.reactions.reduce((sum, r) => sum + r.count, 0)} реакций
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button onClick={loadMore} disabled={loading} className={style.loadMoreButton}>
                  {loading ? "Загрузка..." : "Загрузить ещё"}
                </button>
              </article>

              <aside className={style.sidebar}>
                {channelInfo.pinnedMessage && (
                  <div className={style.widget}>
                    <h2 className={style.sectionTitle}>📌 Закреп:</h2>
                    <div className={style.postText}>
                      <p>{channelInfo.pinnedMessage.text}</p>
                    </div>
                    <div className={style.statItem}>
                      <FaEye /> {formatNumber(channelInfo.pinnedMessage.views)} ·{" "}
                      <FaShare /> {formatNumber(channelInfo.pinnedMessage.forwards)}
                    </div>
                  </div>
                )}
                {similarChannels &&
                  <div className={style.widget}>
                    <h2 className={style.sectionTitle}>Похожие каналы</h2>
                    <div className={style.categoryTag}>Категория: {category}</div>
                    <div className={style.widgetContent}>
                      <SimilarChannels similarChannels={similarChannelData} category={category} />
                    </div>
                  </div>
                }
                {channelInfo.users && channelInfo.users.length > 0 && (
                  <div className={style.widget}>
                    <h2 className={style.sectionTitle}>Боты</h2>
                    <ul className={style.categoriesList1}>
                      {channelInfo.users.slice(0, 10).map((user, index) => (
                        <li key={index} className={style.categoryItem1}>
                          <Link href={`https://t.me/${user.username}`} className={style.categoryLink}>
                            <span>{user.username ? `@${user.username}` : ""}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className={style.widget}>
                  <h2 className={style.sectionTitle}>
                    <Link href={`/`} title="Телеграм каналы">Каталог</Link>
                  </h2>
                  <ul className={style.categoriesList1}>
                    {Object.entries(categoriesMap).map(([categoryKey, categoryTitle]) => (
                      <li key={categoryKey} className={style.categoryItem1}>
                        <Link href={`/category/${categoryKey}`} className={style.categoryLink}>
                          {categoryIconsMap[categoryKey] && (
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
                <div className={style.widget}>
                  <h2 className={style.sectionTitle}>Интересные каналы</h2>
                  <div className={style.widgetContent}>
                    <SimilarChannels similarChannels={intrestingChannelData} category={interestingCategory} />
                  </div>
                </div>
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

function classifyChannel(channelData, categoriesMap) {
  const text = `${channelData.title || ""} ${channelData.description || ""}`.toLowerCase();
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
  for (const [cat, words] of Object.entries(keywordsMap)) {
    for (const word of words) {
      if (text.includes(word)) {
        return { category: cat, category_ru: categoriesMap[cat] };
      }
    }
  }
  return { category: "other", category_ru: categoriesMap["other"] };
}

export async function getServerSideProps(context) {
  const { channel } = context.query;
  try {
    // Запрос БЕЗ медиа для быстрой загрузки
    const channelRes = await axios(`https://teletype.su/api/getChannels?username=${channel}&skip_media=1`);
    const channelData = channelRes.data;
    if (!channelData?.channel) {
      return { notFound: true };
    }

    const client = await clientPromise;
    const db = client.db("tgstat");
    const collection = db.collection("channels");

    let findChannel = await collection.findOne({ username: channel });
    if (!findChannel) {
      const { category, category_ru } = classifyChannel(channelData.channel, categoriesMap);
      const newChannel = {
        username: channelData.channel.username,
        title: channelData.channel.title || "",
        description: channelData.channel.description || "",
        subscribers: channelData.channel.participantsCount || 0,
        avatarData: channelData.channel.photo
          ? channelData.channel.photo.replace(/^data:image\/\w+;base64,/, "")
          : null,
        category,
        category_ru,
      };
      await collection.insertOne(newChannel);
      findChannel = newChannel;
    }

    let similarChannels = [];
    if (findChannel?.category) {
      const pipeline = [
        { $match: { category: findChannel.category, username: { $ne: channel } } },
        { $sample: { size: 10 } },
        { $project: { _id: 0, username: 1, title: 1, subscribers: 1, avatarData: 1 } },
      ];
      similarChannels = await collection.aggregate(pipeline).toArray();
    }

    const allCategories = Object.keys(categoriesMap);
    const safeCategories = allCategories.filter(c => !["other", "adult", "erotica"].includes(c));
    const randomCategoryKey = safeCategories.length
      ? safeCategories[Math.floor(Math.random() * safeCategories.length)]
      : "other";
    const interestingCategoryName = categoriesMap[randomCategoryKey] || "Другое";

    const interestingPipeline = [
      { $match: { category: randomCategoryKey } },
      { $sample: { size: 10 } },
      { $project: { _id: 0, username: 1, title: 1, subscribers: 1, avatarData: 1 } },
    ];
    const interestingChannels = await collection.aggregate(interestingPipeline).toArray();

    return {
      props: {
        initialChannel: channelData.channel,
        initialPosts: channelData.posts || [],
        channelName: channel,
        similarChannels: JSON.stringify(similarChannels),
        category: findChannel?.category_ru || null,
        engCategory: findChannel?.category || null,
        interestingChannels: JSON.stringify(interestingChannels),
        interestingCategory: interestingCategoryName,
      },
    };
  } catch (err) {
    console.error("getServerSideProps error:", err);
    return { notFound: true };
  }
}