// Require necessary packages
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Import the user model
const User = require("../models/UserModel");

// Import validation functions
const validateRegisterInput = require("../validation/registerValidation");

// Import protected routes
const requiresAuth = require("../middleware/permissions");

// Configure express router
const router = express.Router();

// Set up the routes

// @route    GET /api/auth
// @desc     Test the auth route
// @access   Public
router.get("/", (req, res) => {
  res.send("Auth route working");
});

// @route    POST /api/auth/register
// @desc     Create a new user
// @access   Public
router.post("/register", async (req, res) => {
  try {
    // run input fields validations
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    // check that the new user does not already exist by validating the email
    const existingEmail = await User.findOne({
      email: new RegExp("^" + req.body.email + "$", "i"),
    });
    if (existingEmail) {
      return res
        .status(400)
        .json({ error: "There is already a user with this email" });
    }
    // hash the new user password
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    // create a new user with the user model
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
    });

    // save the new user to the database
    const savedUser = await newUser.save();

    const userToreturn = { ...savedUser._doc };
    delete userToreturn.password;

    // return the new user
    return res.json(userToreturn);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

// @route    POST /api/auth/login
// @desc     Login user and return an access token
// @access   Public
router.post("/login", async (req, res) => {
  try {
    // check that the user exists before they can login
    const user = await User.findOne({
      email: new RegExp("^" + req.body.email + "$", "i"),
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "There was a problem with your login credentials" });
    }

    // validate the user password
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordMatch) {
      return res
        .status(400)
        .json({ error: "There was a problem with your login credentials" });
    }

    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("access-token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    const userToreturn = { ...user._doc };
    delete userToreturn.password;

    return res.json({
      token: token,
      user: userToreturn,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send(error.message);
  }
});

// @route    POST /api/auth/current
// @desc     Return the currently authed user
// @access   Private
router.get("/current", requiresAuth, (req, res) => {
  if (!req.user) {
    return res.status(401).send("Unauthorized");
  }

  return res.json(req.user);
});

// Export the router
module.exports = router;
