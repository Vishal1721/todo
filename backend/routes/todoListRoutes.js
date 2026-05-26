const { createItem } = require("../controllers/TodoItems/createTodoItems");
const { updateItem } = require("../controllers/TodoItems/updateTodoItems");
// const { markReminder } = require("../controllers/TodoItems/markReminderSent");
const { getTodoItems } = require("../controllers/TodoItems/getTodoItems");
const { deleteItem } = require("../controllers/TodoItems/deleteTodoItems");
// const { getStats } = require("../controllers/TodoItems/getTodoStats");
const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");

const router = express.Router();

router.post("/:listId/items", authMiddleware, createItem);

router.patch("/todo-items/:itemId", authMiddleware, updateItem);

// router.delete("/todo-items/:itemId", authMiddleware, deleteItem);
router.get("/:listId/items", authMiddleware, getTodoItems);
// router.patch("/todo-items/:itemId/reminder-sent", authMiddleware, markReminder);
// router.get("/:listId/stats", authMiddleware, getStats);
module.exports = router;
