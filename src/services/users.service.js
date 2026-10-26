const prisma = require("../db");

async function getUsers({
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  order = "desc",
  isPrivate,
  search,
  hasPosts,
}) {
  const where = {};
  if (hasPosts === "true") {
    where.posts = { some: {} };
  } else if (hasPosts === "false") {
    where.posts = { none: {} };
  }

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
  return prisma.user.findUnique({
    where: { id: Number(id) },
    include: {
      _count: {
        select: {
          posts: true,
          likes: true,
        },
      },
    },
  });
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

async function getUserPosts(id, { page = 1, limit = 10 }) {
  const userId = Number(id);
  const skip = (page - 1) * limit;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    return null;
  }

  const [data, total] = await prisma.$transaction([
    prisma.post.findMany({
      where: { authorId: userId },
      include: {
        _count: {
          select: { likes: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.post.count({
      where: { authorId: userId },
    }),
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
async function getUserPosts(id, { page = 1, limit = 10 }) {
  const userId = Number(id);
  const skip = (page - 1) * limit;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) return null;

  const [data, total] = await prisma.$transaction([
    prisma.post.findMany({
      where: { authorId: userId },
      include: {
        _count: {
          select: { likes: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.post.count({
      where: { authorId: userId },
    }),
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

async function getLikedPosts(id, { page = 1, limit = 10 }) {
  const userId = Number(id);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) return null;

  const where = {
    likes: { some: { userId } },
  };

  const skip = (page - 1) * limit;

  const [data, total] = await prisma.$transaction([
    prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullname: true,
          },
        },
        _count: { select: { likes: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.post.count({ where }),
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


module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
getUserPosts,
getLikedPosts,
};
