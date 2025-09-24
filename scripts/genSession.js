// scripts/genSession.js
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input"); // npm install input

const apiId = 26254561;
const apiHash = "cb87483d0e8bf111f97a2e5fbeb5fd1d";

(async () => {
  const client = new TelegramClient(new StringSession(""), apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.start({
    phoneNumber: async () => await input.text("Введите номер телефона: "),
    password: async () => await input.text("Введите 2FA пароль (если есть): "),
    phoneCode: async () => await input.text("Введите код из Telegram: "),
    onError: (err) => console.log(err),
  });

  console.log("Сессия:", client.session.save());
})();
