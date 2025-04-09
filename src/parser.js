import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import input from "input";
import dotenv from "dotenv";
dotenv.config();

const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;

const client = new TelegramClient(new StringSession(""), apiId, apiHash, {
  connectionRetries: 5,
});

async function run() {
  await client.start({
    phoneNumber: async () => input.text("Phone: "),
    password: async () => input.text("Password: "),
    phoneCode: async () => input.text("Code: "),
    onError: (err) => console.log(err),
  });

  console.log("✅ Logged in!");
  console.log("🔐 SESSION_STRING:");
  console.log(client.session.save()); // вот её вставишь в .env
}
run();
