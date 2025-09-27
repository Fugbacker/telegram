import { Api } from "telegram";
import { getTelegramClient, safeConnect } from "../../utils/telegramClient";

const client = getTelegramClient();

export const config = {
  api: {
    responseLimit: false,
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { channel, messageId } = req.query;
  if (!channel || !messageId) {
    return res.status(400).json({ error: "Missing channel or messageId" });
  }

  try {
    await safeConnect();

    // Получаем сообщение
    const history = await client.invoke(
      new Api.messages.GetHistory({
        peer: channel,
        limit: 1,
        offsetId: parseInt(messageId),
        addOffset: -1,
      })
    );

    const message = history.messages.find((m) => m.id === parseInt(messageId));
    if (!message || !message.media?.document) {
      return res.status(404).json({ error: "Message or video not found" });
    }

    const doc = message.media.document;

    console.log("🔍 Анализ видео:", {
      messageId: parseInt(messageId),
      channel,
      mimeType: doc.mimeType,
      size: doc.size?.valueOf?.() || doc.size,
      id: doc.id.toString(),
      accessHash: doc.accessHash.toString(),
      fileReference: doc.fileReference?.toString("base64") || null,
      attributes: doc.attributes?.map(a => ({
        type: a.className,
        fileName: a.fileName,
        duration: a.duration,
        width: a.w,
        height: a.h,
      })),
      thumbs: doc.thumbs?.length || 0,
    });

    const videoSize = doc.size?.valueOf?.() || doc.size || 0;
    let mimeType = doc.mimeType;

// Если mimeType не установлен или некорректен — пробуем определить по расширению или использовать mp4
if (!mimeType || !mimeType.startsWith("video/")) {
  // Попробуем получить расширение из имени файла (если есть)
  const fileName = doc.attributes?.find(a => a instanceof Api.DocumentAttributeFilename)?.fileName;
  if (fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
      case 'mp4':
        mimeType = 'video/mp4';
        break;
      case 'mov':
        mimeType = 'video/quicktime';
        break;
      case 'webm':
        mimeType = 'video/webm';
        break;
      case 'avi':
        mimeType = 'video/x-msvideo';
        break;
      default:
        mimeType = 'video/mp4'; // fallback
    }
  } else {
    mimeType = 'video/mp4'; // fallback
  }
}

    const range = req.headers.range;
    if (!range) {
      // Отдаём всё видео чанками по 1 МБ
      res.setHeader("Content-Type", mimeType);
      res.setHeader("Content-Length", videoSize);
      res.setHeader("Accept-Ranges", "bytes");

      const CHUNK_SIZE = 1024 * 1024; // 1 MB
      let offset = 0;

      while (offset < videoSize) {
        const limit = Math.min(CHUNK_SIZE, videoSize - offset);
        const location = new Api.InputDocumentFileLocation({
          id: doc.id,
          accessHash: doc.accessHash,
          fileReference: doc.fileReference,
          thumbSize: "", // ← обязательно!
        });

        const chunk = await client.downloadFile(location, { offset, limit });
        if (!chunk || chunk.length === 0) break;

        res.write(chunk);
        offset += chunk.length;

        // Добавим небольшую задержку, чтобы не перегружать Telegram API
        await new Promise((r) => setTimeout(r, 10));
      }

      res.end();
      return;
    }

    // Обработка Range-запроса (для перемотки и частичной загрузки)
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
    const chunkSize = end - start + 1;

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": mimeType,
    });

    const location = new Api.InputDocumentFileLocation({
      id: doc.id,
      accessHash: doc.accessHash,
      fileReference: doc.fileReference,
      thumbSize: "",
    });

    const chunk = await client.downloadFile(location, {
      offset: start,
      limit: chunkSize,
      timeout: 30000, // 30 секунд
    });

    if (chunk && chunk.length > 0) {
      res.end(chunk);
    } else {
      res.status(416).end("Requested Range Not Satisfiable");
    }
  } catch (err) {
    console.error("❌ Ошибка streamVideo:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    } else {
      // Если заголовки уже отправлены, просто завершаем
      res.end();
    }
  }
}