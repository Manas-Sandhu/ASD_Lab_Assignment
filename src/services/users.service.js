
const prisma = require("../db");

async function getUsers({
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  order = "desc",
  isPrivate,
  search,
}) {
  const where = {};

  if (isPrivate !== undefined) {
    where.isPrivate = isPrivate;
  }

  if (search) {
    where.OR = [
      { username: { contains: search, mode: "insensitive" } },
      { fullname: { contains: search, mode: "insensitive" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [data, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      orderBy: { [sortBy]: order },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function getUserById(id) {
  return prisma.user.findUnique({ where: { id: Number(id) } });
}

async function createUser(data) {
  return prisma.user.create({ data });
}

async function updateUser(id, data) {
  return prisma.user.update({
    where: { id: Number(id) },
    data,
  });
}

async function deleteUser(id) {
  return prisma.user.delete({ where: { id: Number(id) } });
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
