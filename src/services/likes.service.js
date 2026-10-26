
const prisma = require("../db");

async function createLike(postId, userId) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true },
  });

  if (!post) {
    const error = new Error("Post not found");
    error.status = 404;
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  try {
    return await prisma.like.create({
      data: { postId, userId },
    });
  } catch (error) {
    if (error.code === "P2002") {
      const conflict = new Error("Already liked");
      conflict.status = 409;
      throw conflict;
    }
    throw error;
  }
}

async function deleteLike(postId, userId) {
  try {
    return await prisma.like.delete({
      where: {
        userId_postId: { userId, postId },
      },
    });
  } catch (error) {
    if (error.code === "P2025") {
      const notFound = new Error("Like not found");
      notFound.status = 404;
      throw notFound;
    }
    throw error;
  }
}

module.exports = { createLike, deleteLike };
