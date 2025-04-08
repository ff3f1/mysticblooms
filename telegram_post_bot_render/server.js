
const express = require('express');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== НАСТРОЙКИ =====
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_USERNAME = '@mysticbloomsflower';
const bot = new TelegramBot(TOKEN, { polling: true });

// ===== СЛУШАЕМ ПОСТЫ =====
bot.on('message', (msg) => {
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

    // Добавляем новый пост в начало списка
    posts.unshift(post);
    // Ограничим до 50 постов
    posts = posts.slice(0, 50);

    fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2));
  }
});

// ===== ОТДАЁМ posts.json =====
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Бот работает. /public/posts.json');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// ===== ПРОКСИ ДЛЯ ЗАГРУЗКИ ФОТО ИЗ ТГ =====
app.get('/photo/:fileId', async (req, res) => {
  const fileId = req.params.fileId;

  try {
    const file = await bot.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${TOKEN}/${file.file_path}`;
    
    const response = await fetch(fileUrl);
    const buffer = await response.arrayBuffer();

    res.setHeader('Content-Type', 'image/jpeg');
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error('Ошибка при загрузке фото:', err);
    res.status(500).send('Ошибка при загрузке фото');
  }
});
