const auth = require("./auth")
const db = require("./firestore")
const { getPost } = require("./post")

async function mapUser(user) {
	const { uid, email } = user
	console.log(user)
	const { displayName, photoURL } = user.providerData[0]

	const snapshot = await db.collection("posts").where("authorId", "==", uid).get()

	const posts = snapshot.docs.map(async (doc) => {
		return await getPost(doc.id)
	})

	return {
		id: uid,
		email,
		displayName,
		photoURL,
		posts: await Promise.all(posts),
	}
}

async function updatePhoto(userId, photoURL) {
	await auth.updateUser(userId, {
		photoURL,
	})
}

function updateDisplayName(userId, displayName) {
	auth.updateUser(userId, {
		displayName,
	})
}

module.exports = {
	mapUser,
	updatePhoto,
	updateDisplayName,
}
