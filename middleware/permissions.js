const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const requiresAuth = async (req, res, next) => {
  const token = req.cookies["access-token"];
  let isAuthed = false;

  if (token) {
    try {
      const { userId } = jwt.verify(token, process.env.JWT_SECRET);
      try {
        const user = await User.findById(userId);

        if (user) {
          const userToreturn = { ...user._doc };
          delete userToreturn.password;
          req.user = userToreturn;
          isAuthed = true;
        }
      } catch {
        isAuthed = false;
      }
    } catch (error) {
      isAuthed = false;
    }
  }

  if (isAuthed) {
    return next();
  } else {
    return res.status(401).send("Unauthorized");
  }
};

module.exports = requiresAuth;
