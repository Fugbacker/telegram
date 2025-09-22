// pages/api/parseTgstatPuppeteer.js
import clientPromise from '@/libs/mongodbClient'; // <-- Проверьте путь
import axios from 'axios';
import sharp from 'sharp';

export default async function handler(req, res) {
  const dbName = 'tgstat';
  const collectionName = 'channels';

  let puppeteer;
  let chromium;
  let browser = null;

  const categoriesMap = {
    // blogs: "Блоги",
    // news: "Новости и СМИ",
    // entertainment: "Юмор и развлечения",
    // tech: "Технологии",
    // economics: "Экономика",
    // business: "Бизнес и стартапы",
    // crypto: "Криптовалюты",
    // travels: "Путешествия",
    // marketing: "Маркетинг, PR, реклама",
    // psychology: "Психология",
    // design: "Дизайн",
    // politics: "Политика",
    // art: "Искусство",
    // law: "Право",
    // education: "Образование",
    // books: "Книги",
    // language: "Лингвистика",
    // career: "Карьера",
    // edutainment: "Познавательное",
    // courses: "Курсы и гайды",
    // sport: "Спорт",
    // beauty: "Мода и красота",
    // medicine: "Медицина",
    // health: "Здоровье и Фитнес",
    // pics: "Картинки и фото",
    // apps: "Софт и приложения",
    // video: "Видео и фильмы",
    // music: "Музыка",
    // games: "Игры",
    // food: "Еда и кулинария",
    quotes: "Цитаты",
    handmade: "Рукоделие",
    babies: "Семья и дети",
    // nature: "Природа",
    // construction: "Интерьер и строительство",
    // telegram: "Telegram",
    // instagram: "Инстаграм",
    // sales: "Продажи",
    // transport: "Транспорт",
    // religion: "Религия",
    // esoterics: "Эзотерика",
    // darknet: "Даркнет",
    // gambling: "Букмекерство",
    // shock: "Шок-контент",
    // erotica: "Эротика",
    // adult: "Для взрослых",
    // other: "Другое"
  };

  // --- ДОБАВЛЕННАЯ ФУНКЦИЯ ДЛЯ ПАРАЛЛЕЛЬНОЙ ОБРАБОТКИ АВАТАРОВ ---
  // Функция для обработки одного аватара
  async function processAvatar(avatarUrl, username) {
    let avatarBuffer = null;
    let avatarContentType = null;

    if (avatarUrl) {
      try {
        // console.log(`  📥 Загрузка аватара для @${username}...`);
        const imageResponse = await axios.get(avatarUrl, {
          responseType: 'arraybuffer',
          timeout: 10000 // 10 секунд таймаут
        });
        const originalImageBuffer = imageResponse.data;

        // console.log(`  🔄 Обработка аватара для @${username}...`);
        avatarBuffer = await sharp(originalImageBuffer)
          .resize({ width: 100, height: 100, fit: 'cover', withoutEnlargement: true })
          .jpeg({ quality: 70, mozjpeg: true })
          .toBuffer();

        const metadata = await sharp(avatarBuffer).metadata();
        avatarContentType = `image/${metadata.format}`;
        // console.log(`  ✅ Аватар для @${username} обработан.`);

      } catch (imgError) {
        console.error(`  ⚠️ Ошибка обработки аватара для @${username}:`, imgError.message);
      }
    } else {
      console.log(`  ⚠️ Нет URL аватара для @${username}`);
    }
    return { avatarBuffer, avatarContentType };
  }

  // Функция для параллельной обработки аватаров с ограничением
  async function processAvatarsInParallel(channelsBatch, concurrencyLimit = 10) {
    const results = [];
    for (let i = 0; i < channelsBatch.length; i += concurrencyLimit) {
      const batch = channelsBatch.slice(i, i + concurrencyLimit);
      // console.log(`  🚀 Обработка пакета из ${batch.length} аватаров...`);
      const batchPromises = batch.map(channel => processAvatar(channel.avatarUrl, channel.username));
      const batchResults = await Promise.allSettled(batchPromises);
      results.push(...batchResults);
      // console.log(`  ✅ Пакет обработан.`);
    }
    return results;
  }
  // --- КОНЕЦ ДОБАВЛЕННЫХ ФУНКЦИЙ ---

  try {
    chromium = (await import('@sparticuz/chromium')).default;
    puppeteer = await import('puppeteer-core');
  } catch (err) {
    console.error("❌ Ошибка импорта puppeteer/chromium:", err.message);
    return res.status(500).json({ message: 'Ошибка импорта', error: err.message });
  }

  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const launchOptions = {
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
      defaultViewport: chromium.defaultViewport,
      args: [...chromium.args, "--hide-scrollbars", "--disable-web-security", "--no-sandbox", "--disable-setuid-sandbox"],
    };

    browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
    );

    // ====== Cookies авторизации ======
const cookies = [
  // Значения обновлены из Postman запроса
  { name: '_tgstat_csrk', value: '6850e7b823d879fdf2fa3cfc458741262b616dce2210e4c7d48e627eb20254cfa%3A2%3A%7Bi%3A0%3Bs%3A12%3A%22_tgstat_csrk%22%3Bi%3A1%3Bs%3A32%3A%22emYkAolP4cgEf1LbiUZVKb6L9W-Neu2D%22%3B%7D', domain: '.tgstat.ru', path: '/' },
  { name: 'tgstat_idrk', value: '3323055633ae288c5f78588e67dde8c5a0d95ea57e87432b79deea699fc37600a%3A2%3A%7Bi%3A0%3Bs%3A11%3A%22tgstat_idrk%22%3Bi%3A1%3Bs%3A52%3A%22%5B2866092%2C%22G2PC5h18MYHGZpf-H3bmpu717pb0mPbd%22%2C2592000%5D%22%3B%7D', domain: '.tgstat.ru', path: '/' },
  { name: 'tgstat_sirk', value: 'qgq1265egp6j3rpmpl48hbihk7', domain: '.tgstat.ru', path: '/' },
  { name: '_ym_uid', value: '1750958933580409915', domain: '.tgstat.ru', path: '/' },
  { name: '_ym_d', value: '1756971716', domain: '.tgstat.ru', path: '/' },
  { name: 'cf_clearance', value: '1SCUvT9iFo6IX1ltK91apdXUt6UyuHxXP2_9xfFIuSc-1757932266-1.2.1.1-8UoZJUa_3jYJSyRdXb9XeNYzbAbNQRbD4QrKs.tFtLi4SG4Iz4NDPpS0jNW_YQtPX1e6BL7uwe7EfxjN9ekkYxTTXcplDxZjYtR0ux11cEkVyfeUYoHhxLnkrVFxYwYmleBRvc0byp3tDOdQOAs3EzSyZ.vgOgnoGjZgspWZ.XH_x04pHMo9eyjkm8voU2VU4XzM6dWo4neOct.8hvbv06TPsoZucr9zpFZ3J250LPw', domain: '.tgstat.ru', path: '/' },

];
    await page.setCookie(...cookies);

    const categories = Object.keys(categoriesMap);

    let totalParsed = 0;
    let totalUniqueParsed = 0;
    const globalProcessed = new Set();

    for (const category of categories) {
      console.log(`\n🧭 Начинаем парсинг категории: ${category} (${categoriesMap[category]})`);
      // Исправлен URL (убран лишний пробел)
      await page.goto(`https://tgstat.ru/${category}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForSelector('.peer-item-box', { timeout: 15000 }).catch(() => console.log("⚠️ Нет каналов на странице"));

      let clickAttempts = 0;
      // const maxClickAttempts = 30;
      let categoryUnique = 0;

      while (true) {
        // --- ИЗВЛЕЧЕНИЕ ДАННЫХ ---
        const channelsDataRaw = await page.evaluate(() => {
          const channels = [];
          document.querySelectorAll('.peer-item-box').forEach(el => {
            let username = '';
            const link = el.querySelector('a[href*="/channel/@"]');
            if (link) {
              const match = link.getAttribute('href').match(/@([^\/\?#]+)/);
              if (match) username = match[1];
            }
            if (!username) return;

            const title = el.querySelector('.font-16.text-dark.text-truncate')?.textContent.trim() || '';
            const description = el.querySelector('.font-14.text-muted.line-clamp-2')?.textContent.trim() || '';
            const subscribersText = el.querySelector('.font-12.text-truncate b')?.textContent.trim() || '0';
            const subscribers = parseInt(subscribersText.replace(/\s/g, ''), 10) || 0;
            let avatarUrl = el.querySelector('img.img-thumbnail')?.getAttribute('src') || '';
            if (avatarUrl.startsWith('//')) avatarUrl = 'https:' + avatarUrl;
            // Исправлен URL (убран лишний пробел)
            if (avatarUrl.startsWith('/')) avatarUrl = 'https://tgstat.ru' + avatarUrl;

            channels.push({
              username,
              title,
              description,
              subscribers,
              avatarUrl,
              // lastParsed: new Date().toISOString(), // Добавлено lastParsed
              category: window.location.pathname.split('/')[1]
            });
          });
          return channels;
        });

        // --- ОБРАБОТКА ИЗОБРАЖЕНИЙ И ПОДГОТОВКА ДАННЫХ ДЛЯ СОХРАНЕНИЯ ---
        // 1. Фильтрация уникальных каналов
        const newUniqueChannels = channelsDataRaw.filter(channel => !globalProcessed.has(channel.username));
        // 2. Добавление в глобальный Set
        newUniqueChannels.forEach(channel => globalProcessed.add(channel.username));

        // 3. --- ПАРАЛЛЕЛЬНАЯ ОБРАБОТКА АВАТАРОВ ---
        // console.log('🖼️ Обработка изображений и фильтрация уникальных каналов...');
        const avatarProcessingResults = await processAvatarsInParallel(newUniqueChannels, 10); // Обрабатываем до 10 аватаров одновременно

        // 4. Подготовка данных для сохранения
        const channelsToSave = [];
        for (let i = 0; i < newUniqueChannels.length; i++) {
          const channel = newUniqueChannels[i];
          const processingResult = avatarProcessingResults[i];

          let avatarBuffer = null;
          let avatarContentType = null;

          // Проверяем результат обработки (PromiseSettledResult)
          if (processingResult.status === 'fulfilled') {
            avatarBuffer = processingResult.value.avatarBuffer;
            avatarContentType = processingResult.value.avatarContentType;
          } else {
            // Это означает, что processAvatar была отклонена (rejected)
            console.error(`  ⚠️ Аватар для @${channel.username} не был обработан из-за ошибки:`, processingResult.reason?.message);
            // avatarBuffer и avatarContentType остаются null
          }

          // Убираем avatarUrl из финальных данных
          const { avatarUrl, ...channelDataToSave } = channel;
          channelsToSave.push({
            ...channelDataToSave,
            category_ru: categoriesMap[channel.category],
            avatarData: avatarBuffer, // Buffer или null
            // avatarContentType: avatarContentType, // string или null
          });
          categoryUnique++; // Увеличиваем счетчик внутри цикла
        }

        // --- СОХРАНЕНИЕ В MONGODB ---
        if (channelsToSave.length > 0) {
          console.log(`💾 Сохранение ${channelsToSave.length} новых уникальных каналов в MongoDB...`);
          const bulkOps = channelsToSave.map(channel => ({
            updateOne: {
              filter: { username: channel.username },
              update: { $set: channel },
              upsert: true
            }
          }));

          try {
            const bulkResult = await collection.bulkWrite(bulkOps, { ordered: false });
            console.log(`✅ Сохранено: Новых: ${bulkResult.upsertedCount}, Обновлено: ${bulkResult.modifiedCount}`);
            totalUniqueParsed += channelsToSave.length;
          } catch (dbError) {
            console.error(`❌ Ошибка сохранения в MongoDB:`, dbError.message);
            // Можно выбросить ошибку или продолжить
          }
        } else {
          console.log(`ℹ️ Нет новых уникальных каналов для сохранения в этой порции.`);
        }

        totalParsed += channelsDataRaw.length;

        console.log(` Порция ${clickAttempts + 1}: всего ${channelsDataRaw.length}, новых уникальных ${channelsToSave.length}`);

        // --- ПАГИНАЦИЯ ---
        const loadMoreButton = await page.$('button.lm-button:not(.d-none)'); // Исправлен селектор
        if (loadMoreButton) {
          try {
            const beforeCount = await page.$$eval('.peer-item-box', els => els.length);
            await page.evaluate(() => {
              const btn = document.querySelector('button.lm-button');
              if (btn) { btn.scrollIntoView({ behavior: 'smooth', block: 'center' }); btn.click(); }
            });
            await page.waitForSelector('.lm-loader:not(.d-none)', { timeout: 5000 }).catch(() => {});
            await page.waitForSelector('.lm-loader.d-none', { timeout: 15000 });
            await page.waitForFunction((sel, prev) => document.querySelectorAll(sel).length > prev, { timeout: 15000 }, '.peer-item-box', beforeCount);
            clickAttempts++;
          } catch (paginationError) {
            console.error(`❌ Ошибка пагинации на порции ${clickAttempts + 1}:`, paginationError.message);
            break; // Прерываем цикл пагинации для этой категории
          }
        } else {
          console.log(`📭 Кнопка "Показать больше" не найдена. Категория завершена.`);
          break;
        }
      } // Конец while (пагинация для категории)

      console.log(`✅ Категория "${category}" (${categoriesMap[category]}) завершена. Новых уникальных каналов: ${categoryUnique}`);
    } // Конец for (категории)

    res.status(200).json({ message: 'Все категории обработаны', totalParsed, totalUniqueParsed });
  } catch (err) {
    console.error('❌ Ошибка парсинга:', err.message);
    // Логгируем стек вызовов для отладки
    console.error(err);
    res.status(500).json({ message: 'Ошибка парсинга', error: err.message });
  } finally {
    if (browser) {
      try {
        await browser.close();
        console.log('🏁 Браузер закрыт.');
      } catch (closeError) {
        console.error('⚠️ Ошибка закрытия браузера:', closeError.message);
      }
    }
    console.log('🏁 Все категории обработаны.');
  }
}