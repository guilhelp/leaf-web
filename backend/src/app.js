const PORT = 3000;

const express = require("express");
const bodyParser = require("body-parser");

require("./services/firebase");

const app = express();

const userRouter = require("./routes/user.routes");
const postRouter = require("./routes/post.routes");
const authRouter = require("./routes/auth.routes");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use(authRouter);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
