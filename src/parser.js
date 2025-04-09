import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import input from "input";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;
const SESSION_FILE = "./session.txt";

let stringSession;

if (fs.existsSync(SESSION_FILE)) {
  const savedSession = fs.readFileSync(SESSION_FILE, "utf8");
  stringSession = new StringSession(savedSession.trim());
  console.log("✅ Используется сохранённая сессия");
} else {
  stringSession = new StringSession("");
  console.log("📱 Первая авторизация, нужно ввести номер");
}

const client = new TelegramClient(stringSession, apiId, apiHash, {
  connectionRetries: 5,
});

async function run() {
  await client.start({
    phoneNumber: async () => await input.text("📞 Телефон: "),
    password: async () => await input.text("🔐 Пароль: "),
    phoneCode: async () => await input.text("📩 Код: "),
    onError: (err) => console.log("❌ Ошибка:", err),
  });

  console.log("✅ Вошли в аккаунт");

  // Сохраняем сессию в файл
  const sessionStr = client.session.save();
  fs.writeFileSync(SESSION_FILE, sessionStr);
  console.log("💾 Сессия сохранена в session.txt");

  // Получаем посты
  const channel = await client.getEntity("mysticbloomsflower");
  const messages = await client.getMessages(channel, { limit: 20 });

  const posts = messages
    .filter((msg) => msg.message)
    .map((msg) => ({
      id: msg.id,
      text: msg.message,
      date: Math.floor(msg.date.getTime() / 1000),
      media: !!msg.media,
    }));

  fs.writeFileSync("public/posts.json", JSON.stringify(posts, null, 2));
  console.log("📦 Посты сохранены в public/posts.json");

  process.exit();
}

run();
