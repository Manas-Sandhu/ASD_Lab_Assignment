
const likesService = require("../services/likes.service");

async function createLike(req, res, next) {
  try {
    if (
      req.body.userId === undefined ||
      req.body.userId === null ||
      req.body.userId === ""
    ) {
      return res.status(400).json({ error: "userId is required" });
    }

    const postId = Number(req.params.id);
    const userId = Number(req.body.userId);

    if (
      !Number.isInteger(postId) ||
      postId <= 0 ||
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      return res.status(400).json({ error: "Invalid postId or userId" });
    }

    const like = await likesService.createLike(postId, userId);
    return res.status(201).json(like);
  } catch (error) {
    next(error);
  }
}

async function deleteLike(req, res, next) {
  try {
    const postId = Number(req.params.id);
    const userId = Number(req.params.userId);

    if (
      !Number.isInteger(postId) ||
      postId <= 0 ||
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      return res.status(400).json({ error: "Invalid postId or userId" });
    }

    await likesService.deleteLike(postId, userId);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = { createLike, deleteLike };
