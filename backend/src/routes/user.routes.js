const authMiddleware = require("../middlewares/auth.middleware");
const { mapUser, updatePhoto } = require("../services/user");

const userRouter = require("express").Router();

userRouter.get("/", authMiddleware, async (req, res) => {
  return res.json(mapUser(res.locals.user));
});

userRouter.patch("/", authMiddleware, async (req, res) => {
  const userId = res.locals.user.uid;
  const { photoData, displayName } = req.body;

  const userMapped = mapUser(res.locals.user);

  if (photoData) {
    // const photoURL = await uploadImage(`users/${userId}`, photoData);
    const photoURL = "https://api.placeholder.com/300";
    updatePhoto(userId, photoURL);
    userMapped.photoURL = photoURL;
  }

  if (displayName) {
    updateDisplayName(userId, displayName);
    userMapped.displayName = displayName;
  }

  return res.json(userMapped);
});

userRouter.get("/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;
  const user = await getUser(userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  return res.json(mapUser(user));
});

module.exports = userRouter;
