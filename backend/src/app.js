const PORT = 3000

const express = require("express")
const bodyParser = require("body-parser")

require("./services/firebase")

const app = express()

const userRouter = require("./routes/user.routes")
const postRouter = require("./routes/post.routes")
const authRouter = require("./routes/auth.routes")
const commentRouter = require("./routes/comment.routes")
const { uploadImage } = require("./services/image")

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*")
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE")
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
	res.setHeader("Access-Control-Allow-Credentials", true)
	next()
})

app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/users", userRouter)
app.use("/posts", postRouter)
app.use("/comments", commentRouter)
app.use(authRouter)

app.listen(PORT, () => {
	console.log(`Server listening at http://localhost:${PORT}`)
})
