import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions"; // ✅ ВАЖНО!
import input from "input";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();


const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;
const session = new StringSession(process.env.SESSION_STRING);

const client = new TelegramClient(session, apiId, apiHash, {
  connectionRetries: 5,
});

async function run() {
  await client.start({
    phoneNumber: async () => input.text("Phone: "),
    password: async () => input.text("Password: "),
    phoneCode: async () => input.text("Code: "),
    onError: (err) => console.log(err),
  });

  console.log("✅ Logged in");

  const result = await client.getMessages("mysticbloomsflower", { limit: 20 });

  const posts = result.map((msg) => ({
    id: msg.id,
    text: msg.message,
    date: msg.date,
    media: msg.media ? true : false,
  }));

  fs.writeFileSync("public/posts.json", JSON.stringify(posts, null, 2));
  console.log("📦 Saved to public/posts.json");
}

run();
