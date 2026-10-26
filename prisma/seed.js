const prisma = require("../src/db");
const { users, posts, likes } = require("./seed-data");

async function main() {
  await prisma.like.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const createdUsers = await prisma.user.createManyAndReturn({
    data: users.map((user) => ({
      ...user,
      createdAt: new Date(user.createdAt),
    })),
  });

  const userIds = new Map(createdUsers.map((user) => [user.username, user.id]));

  const createdPosts = await prisma.post.createManyAndReturn({
    data: posts.map(({ author, ...post }) => ({
      ...post,
      createdAt: new Date(post.createdAt),
      authorId: (() => {
        const id = userIds.get(author);

        if (!id) {
          throw new Error(
            `Author not found for post ${post.imageUrl}: "${author}"`,
          );
        }

        return id;
      })(),
    })),
  });

  const postIds = new Map(
    createdPosts.map((post) => [post.imageUrl.split("/")[4], post.id]),
  );

  await prisma.like.createMany({
    data: likes.map(({ user, post }) => ({
      userId: userIds.get(user),
      postId: postIds.get(post),
    })),
  });

  console.log(
    `🌱 Seeded ${createdUsers.length} users, ${createdPosts.length} posts and ${likes.length} likes`,
  );
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
