import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.static("public"));

app.get("/api/posts", (req, res) => {
  const posts = JSON.parse(fs.readFileSync("posts.json"));
  res.json(posts);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
