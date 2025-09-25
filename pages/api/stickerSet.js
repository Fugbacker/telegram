import { Api } from "telegram";
import {
  safeInvoke,
  getTelegramClient,
  downloadImageFile,
  downloadVideoFile,
} from "../../utils/telegramClient";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name } = req.query; // /api/stickerSet?name=Cats
  if (!name) {
    return res.status(400).json({ error: "Missing sticker set name" });
  }

  // try {
    const client = getTelegramClient();

    const result = await client.invoke(
      new Api.messages.GetStickerSet({
        stickerset: new Api.InputStickerSetShortName({
          shortName: name,
        }),
      })
    );

    // Загружаем каждый стикер в base64
    const stickers = await Promise.all(
      result.documents.map(async (doc) => {
        try {
          const buffer = await client.downloadMedia(doc, {});
          const base64 = buffer.toString("base64");
          return {
            id: doc.id.toString(),
            mimeType: doc.mimeType,
            data: `data:${doc.mimeType};base64,${base64}`,
          };
        } catch (e) {
          console.error("Ошибка скачивания стикера:", e);
          return null;
        }
      })
    );

    res.status(200).json({
      title: result.set.title,
      shortName: result.set.shortName,
      count: stickers.filter(Boolean).length,
      stickers: stickers.filter(Boolean),
    });
  // } catch (err) {
  //   console.error("Error fetching sticker set:", err);
  //   res.status(500).json({ error: err.message });
  // }
}
