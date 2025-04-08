require('dotenv').config();
const { Telegraf } = require('telegraf');
const fs = require('fs');
const path = require('path');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Заглушка: эмуляция поста (можно заменить реальным fetch из Telegram API или базы)
bot.command('latest', (ctx) => {
  const post = '🌸 Последний пост с канала Mystic Blooms';
  ctx.reply(post);
});

bot.launch().then(() => {
  console.log('✅ Бот запущен');
});
