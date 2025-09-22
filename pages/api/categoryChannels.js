// pages/api/categoryChannels.js
import clientPromise from '@/libs/mongodbClient';

export default async function handler(req, res) {
  const { category, page = 1 } = req.query;

  // Базовая валидация
  if (!category) {
    return res.status(400).json({ message: 'Параметр category обязателен' });
  }

  const pageNum = parseInt(page, 10);
  const limit = 27;
  const skip = (pageNum - 1) * limit;

  if (isNaN(pageNum) || pageNum < 1) {
    return res.status(400).json({ message: 'Неверный номер страницы' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('tgstat'); // Укажите имя вашей БД
    const collection = db.collection('channels'); // Укажите имя вашей коллекции

    // Проверяем, существует ли категория (опционально)
    // const categoryExists = await collection.distinct("category", { category });
    // if (!categoryExists.includes(category)) {
    //   return res.status(404).json({ message: 'Категория не найдена' });
    // }

    // Получаем каналы для конкретной страницы
    const cursor = collection.find({ category })
                             .sort({ subscribers: -1, _id: 1 }) // Та же сортировка, что и на сервере
                             .skip(skip)
                             .limit(limit);
    const channels = await cursor.toArray();

    // Преобразуем ObjectId в строку для сериализации
    const serializedChannels = channels.map(channel => ({
      ...channel,
      _id: channel._id.toString(),
    }));

    // Также можно вернуть общее количество, если оно может меняться
    // const total = await collection.countDocuments({ category });

    res.status(200).json({
      channels: serializedChannels,
      // total: total,
      page: pageNum,
    });
  } catch (err) {
    console.error('Ошибка API подгрузки каналов:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}