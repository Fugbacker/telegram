// pages/api/streamVideo.js
import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/StringSession.js";

const apiId = 26254561;
const apiHash = "cb87483d0e8bf111f97a2e5fbeb5fd1d";
const stringSession = new StringSession("1AgAOMTQ5LjE1NC4xNjcuNDEBu6VAk89A+4JdQqDYYBWOSk7sLjcie4BjtZL4P3TZm3Tso7byPJmoF4f3TYbp4tj01mibaLwfLKpvwKp9nN8I9cTkZh4gScy/paKXSqXlBEU31EdrRyN8kaVZGrYs8rq0gIGwaClhuB/xeumpmslOZzD104uWS8AVXHR7Bc0vv0teC2O06eWaXrXCJur954d47TpANXf0gO9ivuRB13MehSQBwCnprzTxnWSdFSpmgSu1cmLbWkdMomJ2dFauGrf31Xm/bUspsMw74iR8k7agZz/wdWMVl/11fOq2WU9vJw0cia0mcGB/aIMC9NU6X+2AU8eLTndN1SY86xLWKkhEOp8=");

let client = new TelegramClient(stringSession, apiId, apiHash, {
  connectionRetries: 5,
});

async function ensureConnected() {
  if (!client.connected) {
    await client.connect();
  }
}

// ✅ ОТКЛЮЧАЕМ ЛИМИТ ОТВЕТА — для стриминга видео
export const config = {
  api: {
    responseLimit: false, // ← ВАЖНО: отключаем лимит 4MB
    bodyParser: false,    // ← Опционально: если не используем body
  },
};

export default async function handler(req, res) {
  const { messageId, channel } = req.query;

  if (!messageId || !channel) {
    return res.status(400).json({ error: "Missing messageId or channel" });
  }

  try {
    await ensureConnected();

    // Получаем историю сообщений (можно оптимизировать через кэш или offset)
    const history = await client.invoke(
      new Api.messages.GetHistory({
        peer: channel,
        limit: 1,
        offsetId: parseInt(messageId),
        addOffset: -1, // чтобы получить именно это сообщение
      })
    );

    const message = history.messages.find(m => m.id === parseInt(messageId));
    if (!message || !message.media) {
      return res.status(404).json({ error: "Message or media not found" });
    }

    // 🔥 СТРИМИМ ВИДЕО ЧЕРЕЗ downloadMedia — без base64!
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Accept-Ranges', 'bytes');

    // Используем downloadMedia с outputFile: undefined — получим Buffer
    const buffer = await client.downloadMedia(message.media, {});

    if (!buffer || buffer.length === 0) {
      return res.status(500).json({ error: "Failed to download video" });
    }

    res.setHeader('Content-Length', buffer.length);
    res.status(200).end(buffer);

  } catch (err) {
    console.error("❌ Ошибка стриминга видео:", err);

    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({
      error: "Failed to stream video",
      details: err.message,
    });
  }
}