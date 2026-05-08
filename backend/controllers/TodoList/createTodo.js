const { createList } = require("../../services/todoService");

const createTodo = async (req, res) => {

  try {
    const { name, is_public } = req.body;
    const userId = req.user.id;
    if (!name) {
      return res.status(400).json({
        error: "List name is required",
      });
    }

    const newList = await createList(userId, name, is_public ?? 0);

    res.status(201).json({
      message: "Todo list created successfully",
      list: newList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
};


module.exports = { createTodo };