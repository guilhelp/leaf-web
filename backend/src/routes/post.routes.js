const express = require("express")

const { getPost } = require("../services/post")
const db = require("../services/firestore")
const authMiddleware = require("../middlewares/auth.middleware")
const { uploadImage } = require("../services/image")

const postRouter = express.Router()

postRouter.get("/", authMiddleware, async (req, res) => {
	const userFollowings = await db.collection("follows").where("followerId", "==", res.locals.user.uid).get()

	const followings = userFollowings.docs.map((doc) => doc.data().followingId)

	// if (followings.length <= 0) return res.json([])

	// const posts = await db.collection("posts").where("authorId", "in", followings).get()
	const posts = await db.collection("posts").get()

	const postsMapped = posts.docs.map((doc) => getPost(doc.id))

	return res.json(await Promise.all(postsMapped))
})

postRouter.get("/:postId", authMiddleware, async (req, res) => {
	const { postId } = req.params

	const post = await getPost(postId)

	if (!post) {
		return res.status(404).json({ error: "Post not found" })
	}

	res.json(post)
})

postRouter.post("/", authMiddleware, async (req, res) => {
	// Create a new post
	const { content, image } = req.body

	if (!content && !image) {
		return res.status(400).json({ error: "Content or image is required" })
	}

	const post = db.collection("posts").doc()

	const imageUrl = image ? await uploadImage(`posts/${post.id}`, image) : null

	await post.create({
		authorId: res.locals.user.uid,
		content: req.body.content ? req.body.content : null,
		imageUrl: imageUrl ? imageUrl : null,
	})

	const posted = await getPost(post.id)
	return res.json(posted)
})

postRouter.delete("/:postId", authMiddleware, async (req, res) => {
	const { postId } = req.params

	const post = await db.collection("posts").doc(postId).get()

	if (!post.exists) {
		return res.status(404).json({ error: "Post not found" })
	}

	if (post.data().authorId !== res.locals.user.uid) {
		return res.status(403).json({ error: "Unauthorized" })
	}

	await db.collection("posts").doc(postId).delete()

	return res.status(204).send()
})

postRouter.post("/:postId/like", authMiddleware, async (req, res) => {
	const { postId } = req.params

	const post = await db.collection("posts").doc(postId).get()

	if (!post.exists) {
		return res.status(404).json({ error: "Post not found" })
	}

	const likeRef = db.collection("likes").doc(`${res.locals.user.uid}_${postId}`)

	const like = await likeRef.get()

	if (like.exists) {
		await likeRef.delete()
	} else {
		await likeRef.create({
			userId: res.locals.user.uid,
			postId,
		})
	}

	const likes = await db.collection("likes").where("postId", "==", postId).count().get()

	return res.status(201).json({
		likes: likes.data().count,
	})
})

module.exports = postRouter
