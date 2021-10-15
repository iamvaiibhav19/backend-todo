const express = require("express");
const router = express.Router();
const fetchUser = require("../middlewares/fetchUser");
const Todo = require("../models/Todos");
const { body, validationResult } = require("express-validator");

//ROUTE 1 : Get all todos  : GET " /api/todo/todos" Login Required

router.get("/todos", fetchUser, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.json(todos);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//ROUTE 2 : Get todo by id : GET "/api/todo/todos/:id" Login Required
router.get("/todos/:id", fetchUser, async (req, res) => {
  try {
    //Find the noSte which is to be updated and update it
    let todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).send("Not found");
    }

    if (todo.user.toString() != req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    res.json({ Success: "Todo found!", todo });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//ROUTE 3 : Add a new todo  : POST " /api/todo/addTodo" Login Required

router.post(
  "/addTodo",
  fetchUser,
  [
    body("title", "Enter a valid title").isLength({ min: 5 }),
    body(
      "description",
      "Description must be of atleasat 5 characters"
    ).isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      //checks entered values are true or not - if not then return erros
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const todo = new Todo({
        title,
        description,
        tag,
        user: req.user.id,
      });

      const savedTodo = await todo.save();

      res.json(savedTodo);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//ROUTE 4 : Update an existing todo  : PUT " /api/todos/updateTodo" Login Required

router.put("/updateTodo/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;

  try {
    //create a newTodo Object
    const newTodo = {};
    if (title) {
      newTodo.title = title;
    }
    if (description) {
      newTodo.description = description;
    }
    if (tag) {
      newTodo.tag = tag;
    }

    //Find the noSte which is to be updated and update it
    let todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).send("Not found");
    }

    if (todo.user.toString() != req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { $set: newTodo },
      { new: true }
    );

    res.json({ todo });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//ROUTE 4 : Delete an existing todo  : DELETE " /api/todo/updateTodo/:id" Login Required

router.delete("/deleteTodo/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;

  try {
    //Find the noSte which is to be updated and update it
    let todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).send("Not found");
    }

    if (todo.user.toString() != req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    todo = await Todo.findByIdAndDelete(req.params.id);

    res.json({ Success: "Todo has been deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
