fetch("/posts.json")
  .then((res) => res.json())
  .then((posts) => {
    const container = document.getElementById("posts");

    posts.forEach((post) => {
      const div = document.createElement("div");
      div.className = "mb-4 p-4 bg-white rounded-xl shadow";

      div.innerHTML = `
        <p class="text-gray-800 whitespace-pre-line">${post.text}</p>
        <p class="text-xs text-gray-400 mt-2">${new Date(post.date).toLocaleString()}</p>
      `;

      container.appendChild(div);
    });
  });
