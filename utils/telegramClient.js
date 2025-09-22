// utils/telegramClient.js
import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/StringSession.js";

const apiId = 26254561;
const apiHash = "cb87483d0e8bf111f97a2e5fbeb5fd1d";
const sessionKey =
  "1AgAOMTQ5LjE1NC4xNjcuNDEBu6VAk89A+4JdQqDYYBWOSk7sLjcie4BjtZL4P3TZm3Tso7byPJmoF4f3TYbp4tj01mibaLwfLKpvwKp9nN8I9cTkZh4gScy/paKXSqXlBEU31EdrRyN8kaVZGrYs8rq0gIGwaClhuB/xeumpmslOZzD104uWS8AVXHR7Bc0vv0teC2O06eWaXrXCJur954d47TpANXf0gO9ivuRB13MehSQBwCnprzTxnWSdFSpmgSu1cmLbWkdMomJ2dFauGrf31Xm/bUspsMw74iR8k7agZz/wdWMVl/11fOq2WU9vJw0cia0mcGB/aIMC9NU6X+2AU8eLTndN1SY86xLWKkhEOp8=";

let client = null;
let isConnecting = false;

export function getTelegramClient() {
  if (!client) {
    const stringSession = new StringSession(sessionKey);
    client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 3,
      retryDelay: 1000,
      timeout: 10000,
      autoReconnect: true,
      useWSS: false,
      floodSleepThreshold: 60,
    });
  }
  return client;
}

export async function safeConnect() {
  const client = getTelegramClient();

  if (client.connected) return true;

  if (isConnecting) {
    for (let i = 0; i < 20; i++) {
      if (client.connected) return true;
      await new Promise((r) => setTimeout(r, 500));
    }
    return false;
  }

  try {
    isConnecting = true;
    console.log("Подключение к Telegram...");
    await client.connect();
    console.log("Успешно подключено");
    return true;
  } catch (e) {
    console.error("Ошибка подключения:", e.message);
    return false;
  } finally {
    isConnecting = false;
  }
}

export async function safeInvoke(request, maxRetries = 2) {
  const client = getTelegramClient();
  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const isConnected = await safeConnect();
      if (!isConnected) throw new Error("Не удалось подключиться к Telegram");

      return await Promise.race([
        client.invoke(request),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Таймаут")), 15000)
        ),
      ]);
    } catch (err) {
      lastError = err;
      console.error(`Попытка ${attempt + 1} ошибка:`, err.message);

      if (
        err.message.includes("Not connected") ||
        err.message.includes("Connection") ||
        err.message.includes("timeout")
      ) {
        try {
          await client.disconnect();
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        } catch {}
      } else break;
    }
  }

  throw lastError;
}

// ========== Загрузка файлов ==========

// Фото / превью (ограничиваем до 1 MB)
export async function downloadImageFile(client, location) {
  try {
    const buffer = await client.downloadFile(location, {
      offset: 0,
      limit: 1024 * 1024,
    });
    if (buffer?.length) {
      return `data:image/jpeg;base64,${buffer.toString("base64")}`;
    }
    return null;
  } catch (e) {
    console.warn("Не удалось скачать фото/превью:", e.message);
    return null;
  }
}

// Видео (только если ≤ 10MB)
export async function downloadVideoFile(client, location, videoSize) {
  try {
    if (!videoSize || videoSize > 10 * 1024 * 1024) return null;

    const buffer = await client.downloadFile(location, {
      offset: 0,
      limit: videoSize,
    });
    if (buffer?.length) {
      return `data:video/mp4;base64,${buffer.toString("base64")}`;
    }
    return null;
  } catch (e) {
    console.warn("Не удалось скачать видео:", e.message);
    return null;
  }
}

export async function closeTelegramClient() {
  if (client?.connected) {
    try {
      await client.disconnect();
      console.log("Telegram клиент отключен");
    } catch {}
  }
}

if (typeof process !== "undefined") {
  process.on("SIGTERM", async () => {
    await closeTelegramClient();
    process.exit(0);
  });
  process.on("SIGINT", async () => {
    await closeTelegramClient();
    process.exit(0);
  });
}
