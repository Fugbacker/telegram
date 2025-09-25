// pages/api/streamVideo.js
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
    const videoSize = doc.size?.valueOf?.() || doc.size || 0;
    const mimeType = doc.mimeType || "video/mp4";

    const range = req.headers.range;
    if (!range) {
      // Отдаём целиком
      res.setHeader("Content-Type", mimeType);
      res.setHeader("Content-Length", videoSize);

      const buffer = await client.downloadMedia(message.media, {});
      return res.end(buffer);
    }

    // Range-стриминг
    const CHUNK_SIZE = 2 * 1024 * 1024; // 2 MB
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = Math.min(start + CHUNK_SIZE - 1, videoSize - 1);
    const contentLength = end - start + 1;

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": mimeType,
    });

    // 📌 фикс — thumbSize: "" (пустая строка!)
    const location = new Api.InputDocumentFileLocation({
      id: doc.id,
      accessHash: doc.accessHash,
      fileReference: doc.fileReference,
      thumbSize: "", // ← чтобы не падал CastError
    });

    const buffer = await client.downloadFile(location, {
      offset: start,
      limit: contentLength,
    });

    return res.end(buffer);
  } catch (err) {
    console.error("❌ Ошибка streamVideo:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    }
  }
}
