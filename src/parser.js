import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import input from "input";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;
let session = new StringSession(process.env.SESSION_STRING || "");

const client = new TelegramClient(session, apiId, apiHash, {
  connectionRetries: 5,
});

async function run() {
  if (!process.env.SESSION_STRING) {
    await client.start({
      phoneNumber: async () => await input.text("Phone: "),
      password: async () => await input.text("Password: "),
      phoneCode: async () => await input.text("Code: "),
      onError: (err) => console.log("Auth error:", err),
    });

    const string = client.session.save();
    fs.appendFileSync(".env", `\nSESSION_STRING=${string}`);
    console.log("✅ SESSION_STRING сохранён в .env");
  } else {
    await client.connect();
    console.log("✅ Logged in через сохранённую сессию");
  }

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
  console.log("📦 Saved to public/posts.json");
}

run();
