import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import input from "input";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;
const stringSession = new StringSession(process.env.SESSION_STRING || "");

const client = new TelegramClient(stringSession, apiId, apiHash, {
  connectionRetries: 5,
});

async function run() {
  console.log("🔁 Launching Telegram client...");
  await client.start({
    phoneNumber: async () => input.text("Phone: "),
    password: async () => input.text("Password: "),
    phoneCode: async () => input.text("Code: "),
    onError: (err) => console.log(err),
  });

  console.log("✅ Logged in");

  const session = client.session.save();
  console.log("📥 Session string:", session);

  if (!process.env.SESSION_STRING) {
    fs.appendFileSync(".env", `\nSESSION_STRING=${session}`);
    console.log("✅ SESSION_STRING saved to .env");
  }

  const channel = await client.getEntity("mysticbloomsflower");
  const result = await client.getMessages(channel, { limit: 20 });

  const posts = result
    .filter(msg => msg.message)
    .map(msg => ({
      id: msg.id,
      text: msg.message,
      date: msg.date,
      media: !!msg.media,
    }));

  fs.writeFileSync("public/posts.json", JSON.stringify(posts, null, 2));
  console.log("📦 Saved to public/posts.json");
}

run();
