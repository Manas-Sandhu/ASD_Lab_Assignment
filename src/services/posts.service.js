
const prisma = require("../db");

async function createPost(data) {
  return prisma.post.create({ data });
}

async function listPosts() {
  return prisma.post.findMany();
}

async function getPostById(id) {
  return prisma.post.findUnique({
    where: { id }
  });
}

async function updatePost(id, data) {
  try {
    return await prisma.post.update({
      where: { id },
      data
    });
  } catch (error) {
    if (error.code === "P2025") return null;
    throw error;
  }
}

async function deletePost(id) {
  try {
    await prisma.post.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    if (error.code === "P2025") return false;
    throw error;
  }
}

module.exports = {
  createPost,
  listPosts,
  getPostById,
  updatePost,
  deletePost
};
