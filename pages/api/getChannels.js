// pages/api/getChannels.js
import { Api } from "telegram";
import {
  safeInvoke,
  getTelegramClient,
  downloadImageFile,
} from "../../utils/telegramClient";

const client = getTelegramClient();

/** Выбор лучшего размера фото */
function selectBestPhotoSize(sizes) {
  if (!sizes?.length) return null;
  let best = null;
  let bestFit = 0;
  for (const s of sizes) {
    if (s.w && s.h) {
      const max = Math.max(s.w, s.h);
      if (max <= 320 && max > bestFit) {
        best = s;
        bestFit = max;
      }
    }
  }
  return best || sizes[0];
}

/** Скачивание фото */
async function downloadPhotoSafely(photo) {
  if (!photo?.sizes?.length) return null;
  try {
    const best = selectBestPhotoSize(photo.sizes);
    if (!best) return null;

    const location = new Api.InputPhotoFileLocation({
      id: photo.id,
      accessHash: photo.accessHash,
      fileReference: photo.fileReference,
      thumbSize: best.type,
    });

    return await downloadImageFile(client, location);
  } catch (e) {
    console.warn("Ошибка загрузки фото:", e.message);
    return null;
  }
}

/** Парсинг реакций */
function parseReactions(reactions) {
  if (!reactions?.results?.length) return [];
  return reactions.results.map((r) => ({
    type: r.reaction.className,
    emoji: r.reaction.emoticon || "",
    count: r.count || 0,
  }));
}

/** Информация о канале */
async function parseChannelFull(channelFull, username) {
  const chat = channelFull.chats?.[0];
  const full = channelFull.fullChat;

  let photo = null;
  try {
    const buf = await client.downloadProfilePhoto(username);
    if (buf) photo = `data:image/jpeg;base64,${buf.toString("base64")}`;
  } catch (e) {
    console.warn("Не удалось скачать логотип канала:", e.message);
  }

  return {
    id: full.id.valueOf(),
    title: chat.title,
    username: chat.username || null,
    description: full.about || null,
    participantsCount: full.participantsCount || null,
    verified: !!chat.verified,
    broadcast: !!chat.broadcast,
    megagroup: !!chat.megagroup,
    photo,
  };
}

export default async function handler(req, res) {
  const { username, limit = 10, offset_id = 0 } = req.query;
  if (!username) return res.status(400).json({ error: "Укажи username канала" });

  try {
    console.log(`getChannels: username=${username} limit=${limit} offset_id=${offset_id}`);

    // 1. Информация о канале
    const channel = await safeInvoke(new Api.channels.GetFullChannel({ channel: username }));
    console.log('channel', channel);
    const channelInfo = await parseChannelFull(channel, username);
    console.log('channelInfo', channelInfo);
    // 2. История сообщений
    const history = await safeInvoke(
      new Api.messages.GetHistory({
        peer: username,
        limit: parseInt(limit, 10) || 10,
        offsetId: parseInt(offset_id, 10) || 0,
      })
    );

    // 3. Посты
    const posts = await Promise.all(
      (history.messages || []).map(async (m) => {
        let media = null;

        if (m.media instanceof Api.MessageMediaPhoto) {
          const photoData = await downloadPhotoSafely(m.media.photo);
          media = { type: "photo", data: photoData };
        } else if (m.media instanceof Api.MessageMediaDocument) {
          const doc = m.media.document;
          if (doc.mimeType?.startsWith("video/")) {
            const videoSize = doc.size?.valueOf?.() || doc.size || 0;
            const thumb =
              doc.thumbs?.length > 0 ? await downloadPhotoSafely(doc) : null;

            media = {
              type: "video",
              playable: true,
              size: videoSize,
              mimeType: doc.mimeType,
              thumb,
              fileId: doc.id.toString(),
              accessHash: doc.accessHash.toString(),
              fileReference: doc.fileReference.toString("base64"),
            };
          }
        }

        return {
          id: m.id,
          date: m.date * 1000,
          text: m.message || null,
          media,
          stats: {
            views: m.views || 0,
            forwards: m.forwards || 0,
            reactions: parseReactions(m.reactions),
          },
        };
      })
    );

    return res.status(200).json({ channel: channelInfo, posts });
  } catch (err) {
    console.error("Ошибка API:", err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}
