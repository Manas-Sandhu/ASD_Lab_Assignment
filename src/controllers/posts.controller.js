const postService = require("../services/posts.service");

const allowedSortFields = ["createdAt", "updatedAt","likes"];

function isValidDate(value) {
  if (typeof value !== "string" || value.trim() === "") {
    return false;
  }

  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

async function getPosts(req, res, next) {
  try {
    const page = req.query.page === undefined ? 1 : Number(req.query.page);
    const requestedLimit =
      req.query.limit === undefined ? 10 : Number(req.query.limit);

    if (
      !Number.isInteger(page) ||
      page <= 0 ||
      !Number.isInteger(requestedLimit) ||
      requestedLimit <= 0
    ) {
      return res
        .status(400)
        .json({ error: "page and limit must be positive integers" });
    }

    const limit = Math.min(requestedLimit, 50);
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order || "desc";

    if (!allowedSortFields.includes(sortBy)) {
      return res.status(400).json({
        error: "sortBy must be one of: createdAt, updatedAt, likes",
      });
    }

    if (!["asc", "desc"].includes(order)) {
      return res.status(400).json({
        error: "order must be asc or desc",
      });
    }

    const { from, to } = req.query;

    if (
      (from !== undefined && !isValidDate(from)) ||
      (to !== undefined && !isValidDate(to))
    ) {
      return res.status(400).json({
        error: "from and to must be valid dates",
      });
    }

    const result = await postService.getPosts({
      page,
      limit,
      sortBy,
      order,
      location: req.query.location,
      search: req.query.search,
      from,
      to,
    });

    return res.json(result);
  } catch (error) {
    next(error);
  }
}

async function getPostById(req, res, next) {
  try {
    const post = await postService.getPostById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.json(post);
  } catch (error) {
    next(error);
  }
}

async function createPost(req, res, next) {
  try {
    const { imageUrl, authorId } = req.body;

    if (!imageUrl || !authorId) {
      return res.status(400).json({
        error: "imageUrl and authorId are required",
      });
    }

    const post = await postService.createPost({
      imageUrl,
      authorId: Number(authorId),
    });

    return res.status(201).json(post);
  } catch (error) {
    next(error);
  }
}

async function updatePost(req, res, next) {
  try {
    const post = await postService.updatePost(req.params.id, req.body);
    return res.json(post);
  } catch (error) {
    next(error);
  }
}

async function deletePost(req, res, next) {
  try {
    await postService.deletePost(req.params.id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}
async function getPostLikes(req, res, next) {
  try {
    const likes = await postService.getPostLikes(req.params.id);

    if (likes === null) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.json(likes.map((like) => like.user));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostLikes,
};
