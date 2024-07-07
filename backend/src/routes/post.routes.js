const express = require('express');
const postRouter = express.Router();

postRouter.get('/', (req, res) => {
    res.send("Hello world")
});

module.exports = postRouter;