const express = require('express');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== НАСТРОЙКИ =====
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_USERNAME = '@mysticbloomsflower';

const bot = new TelegramBot(TOKEN, { polling: false });

// Удаляем webhook перед запуском polling
bot.deleteWebhook().then(() => {
  console.log('🚫 Webhook удалён (если был)');
  bot.startPolling();
  console.log('🤖 Бот запущен, ожидаем сообщения...');
});

// ===== ОБРАБОТКА СООБЩЕНИЙ =====
bot.on('channel_post', (msg) => {
  console.log('📩 Получено сообщение:', msg);

  if (msg.chat && msg.chat.username === CHANNEL_USERNAME.replace('@', '')) {
    const post = {
      message_id: msg.message_id,
      date: msg.date,
      text: msg.text || '',
      photo: msg.photo || null
    };

    const postsPath = path.join(__dirname, 'public', 'posts.json');
    let posts = [];

    if (fs.existsSync(postsPath)) {
      posts = JSON.parse(fs.readFileSync(postsPath));
    }

    posts.unshift(post);
    posts = posts.slice(0, 50);

    fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2));
    console.log('✅ Пост сохранён:', post.text.slice(0, 30));
  } else {
    console.log('⚠️ Сообщение не из нужного канала:', msg.chat?.username);
  }
});

// ===== СТАТИКА =====
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Бот работает. Проверь /public/posts.json');
});

app.listen(PORT, () => {
  console.log(`🌐 Сервер слушает порт ${PORT}`);
});
