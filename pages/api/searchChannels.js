// pages/api/liveSearchTelegram.js
import { Api } from "telegram";
import { getTelegramClient } from "@/utils/telegramClient";

export default async function handler(req, res) {
  const { query } = req.query;
  if (!query || query.length < 3) {
    return res.status(400).json({ error: "Минимум 3 символа для поиска" });
  }

  let client;
  try {
    client = getTelegramClient();

    // Проверяем соединение
    if (!client.connected) {
      console.log("Подключение к Telegram...");
      await client.connect();
      console.log("Подключение установлено.");
    }

    console.log(`Поиск по запросу: "${query}"`);
    const result = await client.invoke(
      new Api.contacts.Search({
        q: query,
        limit: 10,
      })
    );

    console.log("result:", result);

    const channels = [];
    if (result?.chats && Array.isArray(result.chats)) {
      for (const chat of result.chats) {
        if (!chat.username) continue; // только публичные каналы

        let photoBase64 = null;
        try {
          const buffer = await client.downloadProfilePhoto(chat);
          if (buffer) {
            photoBase64 = buffer.toString("base64");
          }
        } catch (e) {
          console.warn(`Не удалось загрузить фото канала @${chat.username}:`, e.message);
        }

        channels.push({
          id: chat.id?.valueOf() || null,
          title: chat.title || "",
          username: chat.username || "",
          participantsCount: chat.participantsCount ? Number(chat.participantsCount) : null,
          verified: chat.verified || false,
          avatarData: photoBase64, // уже готовый base64 jpeg
        });
      }
    }



    res.status(200).json({ channels });
  } catch (err) {
    console.error("Ошибка поиска:", err);
    res.status(500).json({ error: "Ошибка при поиске каналов в Telegram" });
  }
}
