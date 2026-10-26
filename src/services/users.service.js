const prisma = require("../db");

async function createUser(data) {
  return prisma.user.create({ data });
}

async function listUsers() {
  return prisma.user.findMany();
}

async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id }
  });
}

async function updateUser(id, data) {
  try {
    return await prisma.user.update({
      where: { id },
      data
    });
  } catch (error) {
    if (error.code === "P2025") return null;
    throw error;
  }
}

async function deleteUser(id) {
  try {
    await prisma.user.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    if (error.code === "P2025") return false;
    throw error;
  }
}

module.exports = {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  deleteUser
};