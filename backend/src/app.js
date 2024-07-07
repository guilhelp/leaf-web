const PORT = 3000

const express = require("express")
const bodyParser = require("body-parser")

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore')
const serviceAccount = require("./leaf-project-2193b-firebase-adminsdk-en4w9-7cfef3f05b.json")

const app = express()

const userRouter = require("./routes/user.routes")
const postRouter = require("./routes/post.routes")
const authRouter = require("./routes/auth.routes")

initializeApp({
    credential: cert(serviceAccount)
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

//app.use("/users", userRouter)
app.use("/posts", postRouter)
//app.use(authRouter)

app.listen(PORT, () => {
	console.log(`Server listening at http://localhost:${PORT}`)
})