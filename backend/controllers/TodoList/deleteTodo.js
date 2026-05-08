const { deleteTodoList } = require("../../services/todoService");

const deleteTodo = async (req, res) => {
  try {
    const listId = Number(req.params.id);

    if (!Number.isInteger(listId)) {
      return res.status(400).json({
        error: "Invalid todo list id",
      });
    }

    const userId = req.user.id;

    const result = await deleteTodoList(listId, userId);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Todo list not found or permission denied",
      });
    }

    res.status(200).json({
      message: "Todo list deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = { deleteTodo };
