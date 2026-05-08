const {
  GetTodoItems
} = require("../../services/todoItemService");

const getTodoItems = (req, res) => {
  try {
    const listId = Number(req.params.listId);
    if (!listId) {
      return res.status(400).json({ message: "Field is empty" });
    }
    const result = GetTodoItems(listId);
    if (!result) {
      return res.status(400).json({ message: "There no data" });
    }
    return res.status(200).json({ message: "Fethced data succesfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server Error" });
  }
};

module.exports = { getTodoItems };
