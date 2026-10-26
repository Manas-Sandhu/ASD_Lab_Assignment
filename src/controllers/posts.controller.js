
const postsService = require("../services/posts.service");

async function create(req, res) {
  const { imageUrl, caption, location } = req.body;

  if (typeof imageUrl !== "string" || !imageUrl.trim()) {
    return res.status(400).json({ error: "imageUrl is required" });
  }

  try {
    const post = await postsService.createPost({
      imageUrl,
      ...(caption !== undefined && { caption }),
      ...(location !== undefined && { location })
    });

    return res.status(201).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function list(req, res) {
  try {
    const posts = await postsService.listPosts();
    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getOne(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(404).json({ error: "Post not found" });
  }

  try {
    const post = await postsService.getPostById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function update(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(404).json({ error: "Post not found" });
  }

  const data = {};

  for (const key of ["imageUrl", "caption", "location"]) {
    if (Object.prototype.hasOwnProperty.call(req.body, key)) {
      data[key] = req.body[key];
    }
  }

  if (
    ("imageUrl" in data &&
      (typeof data.imageUrl !== "string" || !data.imageUrl.trim())) ||
    ("caption" in data &&
      data.caption !== null &&
      typeof data.caption !== "string") ||
    ("location" in data &&
      data.location !== null &&
      typeof data.location !== "string")
  ) {
    return res.status(400).json({ error: "Invalid update data" });
  }

  try {
    const post = await postsService.updatePost(id, data);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function remove(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(404).json({ error: "Post not found" });
  }

  try {
    const deleted = await postsService.deletePost(id);

    if (!deleted) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { create, list, getOne, update, remove };
