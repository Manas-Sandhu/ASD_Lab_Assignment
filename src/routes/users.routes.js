
const express = require("express");
const router = express.Router();
const userController = require("../controllers/users.controller");

router.get("/", userController.getUsers);
router.post("/", userController.createUser);
router.get("/:id", userController.getUserById);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.get("/:id/posts", userController.getUserPosts);
router.get("/:id/liked-posts", userController.getLikedPosts);

module.exports = router;
