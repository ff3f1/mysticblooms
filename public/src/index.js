// public/src/index.js
async function loadPosts() {
  const response = await fetch('/posts.json');
  const posts = await response.json();

  const postsContainer = document.getElementById('posts');
  postsContainer.innerHTML = '';

  posts.forEach(post => {
    const div = document.createElement('div');
    div.className = 'bg-white p-4 rounded-2xl shadow transition hover:shadow-lg';

    div.innerHTML = `
      <p class="text-sm text-gray-600 mb-2">${new Date(post.date * 1000).toLocaleString()}</p>
      <p class="text-lg whitespace-pre-line">${post.text || 'Без текста 🌸'}</p>
    `;

    postsContainer.appendChild(div);
  });
}

loadPosts();
