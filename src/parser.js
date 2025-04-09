import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import input from "input";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;
const session = new StringSession(process.env.SESSION_STRING);

import { StringSession } from "telegram/sessions";
import fs from "fs";

// Путь до файла, где будет сохраняться сессия
const SESSION_FILE = "./session.txt";

let stringSession = new StringSession("");

if (fs.existsSync(SESSION_FILE)) {
  const savedSession = fs.readFileSync(SESSION_FILE, "utf8");
  stringSession = new StringSession(savedSession);
}

const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 });


async function run() {
  await client.start({
    if (!process.env.SESSION_STRING) {
  const string = client.session.save();
  fs.appendFileSync(".env", `\nSESSION_STRING=${string}`);
  console.log("✅ Session string saved to .env");
}

    phoneNumber: async () => input.text("Phone: "),
    password: async () => input.text("Password: "),
    phoneCode: async () => input.text("Code: "),
    onError: (err) => console.log(err),
  });

  console.log("✅ Logged in");

  // ✅ сначала получаем канал
  const channel = await client.getEntity("mysticbloomsflower");

  // ✅ потом получаем сообщения
  const result = await client.getMessages(channel, { limit: 20 });

  const posts = result
    .filter(msg => msg.message) // убрать пустые
    .map((msg) => ({
      id: msg.id,
      text: msg.message,
      date: msg.date,
      media: !!msg.media,
    }));

  fs.writeFileSync("public/posts.json", JSON.stringify(posts, null, 2));
  console.log("📦 Saved to public/posts.json");
}

run();
