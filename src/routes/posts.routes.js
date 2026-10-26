
const express = require("express");
const router = express.Router();
const postController = require("../controllers/posts.controller");
const likesController = require("../controllers/likes.controller");
router.get("/", postController.getPosts);
router.post("/", postController.createPost);
router.get("/:id", postController.getPostById);
router.patch("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);
router.get("/:id/likes", postController.getPostLikes);
router.post("/:id/likes", likesController.createLike);
router.delete("/:id/likes/:userId", likesController.deleteLike);

module.exports = router;
