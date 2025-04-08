require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get('/api/posts', (req, res) => {
  // Пример ответа, заменим позже на реальные посты
  res.json([
    {
      id: 1,
      title: '🌸 Новый пост',
      content: 'Текст поста с Telegram...',
      date: new Date().toISOString()
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`🌐 Сервер запущен на http://localhost:${PORT}`);
});
