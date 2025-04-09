import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import input from "input";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;
let sessionString = process.env.SESSION_STRING || "";

const session = new StringSession(sessionString);
const client = new TelegramClient(session, apiId, apiHash, { connectionRetries: 5 });

async function run() {
  console.log("📲 Starting Telegram client...");
  await client.start({
    phoneNumber: async () => input.text("Phone: "),
    password: async () => input.text("Password: "),
    phoneCode: async () => input.text("Code: "),
    onError: (err) => console.log("❌ Error:", err),
  });

  console.log("✅ Logged in as", await client.getMe().then(u => u.username || u.firstName));

  // Сохраняем сессию после логина
  const string = client.session.save();
  if (!process.env.SESSION_STRING) {
    fs.appendFileSync(".env", `\nSESSION_STRING=${string}`);
    console.log("💾 Session string saved to .env");
  }

  try {
    console.log("🔍 Fetching channel...");
    const channel = await client.getEntity("https://t.me/mysticbloomsflower");

    console.log("📨 Fetching messages...");
    const result = await client.getMessages(channel, { limit: 20 });

    const posts = result
      .filter(msg => msg.message && msg.message.length > 0)
      .map(msg => ({
        id: msg.id,
        text: msg.message,
        date: msg.date.toISOString(),
        media: !!msg.media,
      }));

    console.log("📋 Parsed posts:", posts.length, "items");

    fs.writeFileSync("public/posts.json", JSON.stringify(posts, null, 2));
    console.log("✅ Saved to public/posts.json");
  } catch (err) {
    console.error("❌ Failed to fetch channel or messages:", err.message);
  }
}

run();
