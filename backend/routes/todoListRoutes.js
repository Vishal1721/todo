const { createItem } = require("../controllers/TodoItems/createTodoItems");
const authMiddleware = require("../middleware/authMiddleware");
const express = require("express")
const { updateItem } = require("../controllers/TodoItems/updateTodoItems");
const { getTodoItems } = require("../controllers/TodoItems/getTodoItems");
const router = express.Router();

router.post("/:listId/items", authMiddleware, createItem);

router.patch("/todo-items/:itemId", authMiddleware, updateItem);

router.get("/:listId/items", authMiddleware, getTodoItems);
module.exports = router;
