const db = require("./firestore");

async function getPost(postId) {
  const post = await db.collection("posts").doc(postId).get();

  if (!post.exists) {
    return null;
  }

  const likes = await db
    .collection("likes")
    .where("postId", "==", postId)
    .count()
    .get();

  const comments = await db
    .collection("comments")
    .where("postId", "==", postId)
    .get();

  return {
    id: post.id,
    ...post.data(),
    likesCount: likes.data().count,
    comments: comments.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })),
  };
}

module.exports = {
  getPost,
};
