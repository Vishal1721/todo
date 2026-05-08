const { createItem } = require("../controllers/TodoItems/createTodoItems");
const authMiddleware = require("../middleware/authMiddleware");
const express = require("express")
const { updateItem } = require("../controllers/TodoItems/updateTodoItems");
const router = express.Router();

router.post("/:listId/items", authMiddleware, createItem);

router.patch("/todo-items/:itemId", authMiddleware, updateItem);
module.exports = router;
