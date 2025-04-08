import { motion } from "framer-motion";

const container = document.getElementById("posts");

fetch("/posts.json")
  .then(res => res.json())
  .then(posts => {
    posts.reverse().forEach(post => {
      const card = document.createElement("div");
      card.innerHTML = `
        <div class="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all">
          <p class="text-gray-700">${post.text}</p>
          ${post.photo ? `<img src="${post.photo}" class="mt-4 rounded-lg" />` : ""}
          <a href="https://t.me/mysticbloomsflower/${post.message_id}" target="_blank" class="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">Открыть</a>
        </div>
      `;
      container.appendChild(card);
    });
  });
