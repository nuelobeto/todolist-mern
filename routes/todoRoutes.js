const express = require("express");

const router = express.Router();
const Todo = require("../models/TodoModel");
const requiresAuth = require("../middleware/permissions");
const validateTodoInput = require("../validation/todoValidation");

// @route    GET /api/todos/current
// @desc     Get current user's todos
// @access   Private
router.get("/current", requiresAuth, async (req, res) => {
  try {
    // get completed todos
    const completedTodos = await Todo.find({
      user: req.user._id,
      complete: true,
    }).sort({ completedAt: -1 });

    // get incomplete todos
    const incompleteTodos = await Todo.find({
      user: req.user._id,
      complete: false,
    }).sort({ createdAt: -1 });

    return res.json({
      incomplete: incompleteTodos,
      complete: completedTodos,
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
    const { isValid, errors } = validateTodoInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    // check that a todo is not duplicated
    const existingTodo = await Todo.findOne({
      user: req.user._id,
      content: new RegExp("^" + req.body.content + "$", "i"),
    });

    if (existingTodo) {
      return res.status(400).json({ error: "You have already set this task" });
    }

    // create a new todo
    const newTodo = new Todo({
      user: req.user._id,
      content: req.body.content,
      complete: false,
    });

    // save the new todo to the database
    await newTodo.save();

    return res.json(newTodo);
  } catch (error) {
    console.log(error);

    return res.status(500).send(error.message);
  }
});

// @route    PUT /api/todos/:todoId/complete
// @desc     Mark a todo as complete
// @access   Private
router.put("/:todoId/complete", requiresAuth, async (req, res) => {
  try {
    // get the todo to be marked by the id
    const todo = await Todo.findOne({
      user: req.user._id,
      _id: req.params.todoId,
    });

    if (!todo) {
      return res.status(404).json({ error: "Could not find todo" });
    }

    if (todo.complete) {
      return res.status(400).json({ error: "Todo is already completed" });
    }

    // mark the todo as complete
    const updatedTodo = await Todo.findOneAndUpdate(
      {
        user: req.user._id,
        _id: req.params.todoId,
      },
      {
        complete: true,
        completedAt: new Date(),
      },
      {
        new: true,
      }
    );

    return res.json(updatedTodo);
  } catch (error) {
    console.log(error);

    res.status(500).send(error.message);
  }
});

// @route    PUT /api/todos/:todoId/incomplete
// @desc     Mark a todo as complete
// @access   Private
router.put("/:todoId/incomplete", requiresAuth, async (req, res) => {
  try {
    // get the todo to be marked by the id
    const todo = await Todo.findOne({
      user: req.user._id,
      _id: req.params.todoId,
    });

    if (!todo) {
      return res.status(404).json({ error: "Could not find todo" });
    }

    if (!todo.complete) {
      return res.status(400).json({ error: "Todo is already incompleted" });
    }

    // mark the todo as complete
    const updatedTodo = await Todo.findOneAndUpdate(
      {
        user: req.user._id,
        _id: req.params.todoId,
      },
      {
        complete: false,
        completedAt: null,
      },
      {
        new: true,
      }
    );

    return res.json(updatedTodo);
  } catch (error) {
    console.log(error);

    res.status(500).send(error.message);
  }
});

// @route    PUT /api/todos/:todoId/update
// @desc     Update a todo
// @access   Private
router.put("/:todoId/update", requiresAuth, async (req, res) => {
  try {
    // get the todo to be updated by the id
    const todo = await Todo.findOne({
      user: req.user._id,
      _id: req.params.todoId,
    });

    if (!todo) {
      return res.status(404).json({ error: "Could not find todo" });
    }

    // validate content input field
    const { isValid, errors } = validateTodoInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    // update the todo
    const updatedTodo = await Todo.findOneAndUpdate(
      {
        user: req.user._id,
        _id: req.params.todoId,
      },
      {
        content: req.body.content,
      },
      {
        new: true,
      }
    );
    return res.json(updatedTodo);
  } catch (error) {
    console.log(error);

    res.status(500).send(error.message);
  }
});

// @route    DELETE /api/todos/:todoId/delete
// @desc     Delete a todo
// @access   Private
router.delete("/:todoId/delete", requiresAuth, async (req, res) => {
  try {
    // get the todo to be deleted by the id
    const todo = await Todo.findOne({
      user: req.user._id,
      _id: req.params.todoId,
    });

    if (!todo) {
      return res.status(404).json({ error: "Could not find todo" });
    }

    await Todo.findOneAndRemove({
      user: req.user._id,
      _id: req.params.todoId,
    });

    return res.status(200).json({ sucess: true });
  } catch (error) {
    console.log(error);

    res.status(500).send(error.message);
  }
});

module.exports = router;
