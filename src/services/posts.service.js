const prisma = require("../db");

async function getPosts({
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  order = "desc",
  location,
  search,
  from,
  to,
}) {
  const where = {};

  if (location) {
    where.location = {
      equals: location,
      mode: "insensitive",
    };
  }

  if (search) {
    where.caption = {
      contains: search,
      mode: "insensitive",
    };
  }

  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lt = new Date(to);
  }

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
        _count: {
          select: { likes: true },
        },
      },
      orderBy:
        sortBy === "likes"
          ? [{ likes: { _count: order } }, { createdAt: "desc" }]
          : { [sortBy]: order },
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
async function getPostById(id) {
  return prisma.post.findUnique({
    where: { id: Number(id) },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          fullname: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });
}

async function createPost(data) {
  const author = await prisma.user.findUnique({
    where: { id: Number(data.authorId) },
  });

  if (!author) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  return prisma.post.create({
    data: {
      imageUrl: data.imageUrl,
      authorId: Number(data.authorId),
    },
  });
}

async function updatePost(id, data) {
  return prisma.post.update({
    where: { id: Number(id) },
    data,
  });
}

async function deletePost(id) {
  return prisma.post.delete({ where: { id: Number(id) } });
}

async function getPostLikes(id) {
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    select: { id: true },
  });

  if (!post) {
    return null;
  }

  return prisma.like.findMany({
    where: { postId: Number(id) },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          fullname: true,
        },
      },
    },
    orderBy: {
      user: {
        username: "asc",
      },
    },
  });
}
module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostLikes,
};
