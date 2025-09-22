import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/StringSession.js"; // 👈 явно указываем файл
import input from "input";

const apiId = 26254561;
const apiHash = "cb87483d0e8bf111f97a2e5fbeb5fd1d";
const stringSession = new StringSession(""); // пустая строка — пока без сохранённой сессии

(async () => {
  console.log("Запуск авторизации...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => await input.text("Введите номер телефона: "),
    password: async () => await input.text("Введите пароль 2FA (если есть): "),
    phoneCode: async () => await input.text("Введите код из Telegram: "),
    onError: (err) => console.log(err),
  });

  console.log("Авторизация успешна ✅");
  console.log("Скопируй эту строку и вставь в telegramClient.js:");
  console.log(client.session.save());

  process.exit();
})();
