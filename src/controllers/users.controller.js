const userService = require("../services/users.service");

const allowedSortFields = ["createdAt", "username", "fullname"];

async function getUsers(req, res, next) {
  try {
    const page = req.query.page === undefined ? 1 : Number(req.query.page);
    const requestedLimit =
      req.query.limit === undefined ? 10 : Number(req.query.limit);

    if (
      !Number.isInteger(page) ||
      page <= 0 ||
      !Number.isInteger(requestedLimit) ||
      requestedLimit <= 0
    ) {
      return res
        .status(400)
        .json({ error: "page and limit must be positive integers" });
    }

    const limit = Math.min(requestedLimit, 50);
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order || "desc";

    if (!allowedSortFields.includes(sortBy)) {
      return res.status(400).json({
        error: "sortBy must be one of: createdAt, username, fullname",
      });
    }

    if (!["asc", "desc"].includes(order)) {
      return res.status(400).json({
        error: "order must be asc or desc",
      });
    }

    let isPrivate;

    if (req.query.isPrivate !== undefined) {
      if (!["true", "false"].includes(req.query.isPrivate)) {
        return res.status(400).json({
          error: "isPrivate must be true or false",
        });
      }

      isPrivate = req.query.isPrivate === "true";
    }
    let hasPosts;

    if (req.query.hasPosts !== undefined) {
      if (!["true", "false"].includes(req.query.hasPosts)) {
        return res.status(400).json({
          error: "hasPosts must be true or false",
        });
      }

      hasPosts = req.query.hasPosts;
    }

    const result = await userService.getUsers({
      page,
      limit,
      sortBy,
      order,
      isPrivate,
      search: req.query.search,
      hasPosts,
    });

    return res.json(result);
  } catch (error) {
    next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await userService.getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    next(error);
  }
}

async function createUser(req, res, next) {
  try {
    const user = await userService.createUser(req.body);
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    return res.json(user);
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    await userService.deleteUser(req.params.id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}
async function getUserPosts(req, res, next) {
  try {
    const page = req.query.page === undefined ? 1 : Number(req.query.page);
    const requestedLimit =
      req.query.limit === undefined ? 10 : Number(req.query.limit);

    if (
      !Number.isInteger(page) ||
      page <= 0 ||
      !Number.isInteger(requestedLimit) ||
      requestedLimit <= 0
    ) {
      return res
        .status(400)
        .json({ error: "page and limit must be positive integers" });
    }

    const limit = Math.min(requestedLimit, 50);

    const result = await userService.getUserPosts(req.params.id, {
      page,
      limit,
    });

    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(result);
  } catch (error) {
    next(error);
  }
}

async function getLikedPosts(req, res, next) {
  try {
    const page = req.query.page === undefined ? 1 : Number(req.query.page);
    const requestedLimit =
      req.query.limit === undefined ? 10 : Number(req.query.limit);

    if (
      !Number.isInteger(page) ||
      page <= 0 ||
      !Number.isInteger(requestedLimit) ||
      requestedLimit <= 0
    ) {
      return res.status(400).json({
        error: "page and limit must be positive integers",
      });
    }

    const result = await userService.getLikedPosts(req.params.id, {
      page,
      limit: Math.min(requestedLimit, 50),
    });

    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(result);
  } catch (error) {
    next(error);
  }
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
