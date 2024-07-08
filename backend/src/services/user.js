const auth = require("./auth");
const db = require("./firestore");
const { getPost } = require("./post");

async function mapUser(user) {
  const { uid, email } = user;
  const { displayName, photoURL } = user.providerData[0];

  const posts = [];

  const snapshot = await db
    .collection("posts")
    .where("authorId", "==", uid)
    .get();

  snapshot.forEach((doc) => {
    posts.push(getPost(doc.id));
  });

  return {
    id: uid,
    email,
    displayName,
    photoURL,
    posts,
  };
}

function updatePhoto(userId, photoURL) {
  auth.updateUser(userId, {
    photoURL,
  });
}

function updateDisplayName(userId, displayName) {
  auth.updateUser(userId, {
    displayName,
  });
}

module.exports = {
  mapUser,
  updatePhoto,
  updateDisplayName,
};
