const db = require("../services/firestore");

const commentRouter = require("express").Router();

commentRouter.post("/", async (req, res) => {
  const { postId, content } = req.body;

  if (!postId || !content) {
    return res.status(400).json({ error: "postId and content are required" });
  }

  const comment = db.collection("comments").doc();

  await comment.create({
    postId,
    content,
    authorId: res.locals.user.uid,
  });

  return res.json(await comment.get());
});

module.exports = commentRouter;
