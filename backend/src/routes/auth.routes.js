const authMiddleware = require('../middlewares/auth.middleware');

// Create a router
const authRouter = require('express').Router();

authRouter.get('/auth', authMiddleware, (req, res, next) => {
    res.status(200).json({
        user: res.locals.user,
    })
})

module.exports = authRouter;