const authMiddleware = require("../middlewares/auth.middleware")
const db = require("../services/firestore")
const { mapUser, updatePhoto, updateDisplayName } = require("../services/user")
const auth = require("../services/auth")
const { uploadImage } = require("../services/image")

const userRouter = require("express").Router()

userRouter.get("/", authMiddleware, async (req, res) => {
	const userMapped = await mapUser(res.locals.user)
	return res.json(userMapped)
})

userRouter.patch("/", authMiddleware, async (req, res) => {
	const userId = res.locals.user.uid
	const { photoData, displayName, email, password } = req.body

	const userMapped = await mapUser(res.locals.user)

	if (photoData) {
		const photoURL = await uploadImage(`users/${userId}`, photoData)
		// const photoURL = "https://api.placeholder.com/300"
		console.log(photoURL)
		await updatePhoto(userId, photoURL)
		userMapped.photoURL = photoURL
	}

	if (displayName) {
		updateDisplayName(userId, displayName)
		userMapped.displayName = displayName
	}

	if (email) {
		await auth.updateUser(userId, {
			email,
		})
		userMapped.email = email
	}

	if (password) {
		await auth.updateUser(userId, {
			password,
		})
	}

	return res.json(userMapped)
})

userRouter.get("/:userId", authMiddleware, async (req, res) => {
	const { userId } = req.params
	const user = await auth.getUser(userId)

	if (!user) {
		return res.status(404).json({
			message: "User not found",
		})
	}

	const userMapped = await mapUser(user)

	return res.json(userMapped)
})

userRouter.post("/:userId/follow", authMiddleware, async (req, res) => {
	const { userId } = req.params

	const ref = db.collection("follows").doc(`${res.locals.user.uid}_${userId}`)

	const follow = await ref.get()

	if (follow.exists) {
		ref.delete()
	}

	ref.set({
		followerId: res.locals.user.uid,
		followingId: userId,
	})
})

module.exports = userRouter
