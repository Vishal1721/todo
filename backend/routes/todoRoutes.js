const express = require("express");
const router = express.Router();

const { createTodo } = require("../controllers/TodoList/createTodo");
const { getTodoLists } = require("../controllers/TodoList/getTodoLists");
const { updateTodo } = require("../controllers/TodoList/updateTodo");
const {deleteTodo} = require("../controllers/TodoList/deleteTodo");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createTodo);
router.get("/", authMiddleware, getTodoLists);
router.patch("/:id", authMiddleware, updateTodo);
router.delete("/:id", authMiddleware, deleteTodo); 

module.exports = router;
