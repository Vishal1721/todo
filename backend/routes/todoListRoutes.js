const { createItem } = require("../controllers/TodoItems/createTodoItems");
const { updateItem } = require("../controllers/TodoItems/updateTodoItems");
const { getTodoItems } = require("../controllers/TodoItems/getTodoItems");
const { deleteItem } = require("../controllers/TodoItems/deleteTodoItem");

const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");

const router = express.Router();

router.post("/:listId/items", authMiddleware, createItem);

router.patch("/todo-items/:itemId", authMiddleware, updateItem);

router.delete("/todo-items/:itemId", authMiddleware, deleteItem);

router.get("/:listId/items", authMiddleware, getTodoItems);

module.exports = router;
