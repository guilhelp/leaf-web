const db = require("./firestore")
const auth = require("./auth")

async function getPost(postId) {
	const post = await db.collection("posts").doc(postId).get()

	if (!post.exists) {
		return null
	}

	const likes = await db.collection("likes").where("postId", "==", postId).count().get()

	const comments = await db.collection("comments").where("postId", "==", postId).get()

	let author
	try {
		author = await auth.getUser(post.data().authorId)
	} catch (error) {
		author = {
			displayName: "[Excluído]",
		}
	}

	return {
		id: post.id,
		...post.data(),
		author,
		likesCount: likes.data().count,
		comments: await Promise.all(
			comments.docs.map(async (doc) => {
				console.log("COMENTÁRIOOOOOOOOOOOOO")
				let author
				try {
					author = await auth.getUser(doc.data().authorId)
				} catch (error) {
					author = {
						displayName: "[Excluído]",
					}
				}

				return {
					id: doc.id,
					author,
					...doc.data(),
				}
			})
		),
	}
}

module.exports = {
	getPost,
}
