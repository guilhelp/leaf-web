const auth = require("./auth");
const db = require("./firestore");

function mapUser(user) {
  const { uid, email } = user;
  const { displayName, photoURL } = user.providerData[0];

  const posts = [];

  db.collection("posts")
    .where("authorId", "==", uid)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        posts.push({
          id: doc.id,
          ...doc.data(),
        });
      });
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
