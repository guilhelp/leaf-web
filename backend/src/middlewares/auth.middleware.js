const auth = require("../services/auth");

const authMiddleware = async (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];

  if (!token) {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    const user = await auth.getUser(decodedToken.uid);

    console.log("User", user);
    res.locals.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

module.exports = authMiddleware;
