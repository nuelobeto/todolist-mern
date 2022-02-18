const express = require("express");

const router = express.Router();
const ToDo = require("../models/TodoModel");
const requiresAuth = require("../middleware/permissions");
const validateToDoInput = require("../validation/todoValidation");

// @route    GET /api/todos/current
// @desc     Get current user's todos
// @access   Private
router.get("/current", requiresAuth, async (req, res) => {
  try {
    // get completed todos
    const completedToDos = await ToDo.find({
      user: req.user._id,
      complete: true,
    }).sort({ completedAt: -1 });

    // get incomplete todos
    const incompleteToDos = await ToDo.find({
      user: req.user._id,
      complete: false,
    }).sort({ createdAt: -1 });

    return res.json({
      incomplete: incompleteToDos,
      complete: completedToDos,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send(error.message);
  }
});

// @route    POST /api/todos/new
// @desc     Create a new todo
// @access   Private
router.post("/new", requiresAuth, async (req, res) => {
  try {
    // validate content input field
    const { isValid, errors } = validateToDoInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    // check that a todo is not duplicated
    const existingToDo = await ToDo.findOne({
      user: req.user._id,
      content: new RegExp("^" + req.body.content + "$", "i"),
    });

    if (existingToDo) {
      return res.status(400).json({ error: "You have already set this task" });
    }

    // create a new todo
    const newToDo = new ToDo({
      user: req.user._id,
      content: req.body.content,
      complete: false,
    });

    // save the new todo to the database
    await newToDo.save();

    return res.json(newToDo);
  } catch (error) {
    console.log(error);

    return res.status(500).send(error.message);
  }
});

module.exports = router;
