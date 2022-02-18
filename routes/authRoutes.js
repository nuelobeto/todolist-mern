// Require necessary packages
const express = require("express");
const bcrypt = require("bcryptjs");

// Import the user model
const User = require("../models/UserModel");

// Import validation functions
const validateRegisterInput = require("../validation/registerValidation");

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

    // return the new user
    return res.json(savedUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Export the router
module.exports = router;
