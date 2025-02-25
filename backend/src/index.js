import express from "express";
import { getPosts, getPostById } from "./firebase.js";

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Endpoint to fetch all posts
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await getPosts();
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send("Error fetching posts");
  }
});

// Endpoint to fetch a post by its ID
app.get("/api/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await getPostById(id);
    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(404).send("Post not found");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
