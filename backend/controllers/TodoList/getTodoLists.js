const Joi = require("joi");
const { getUserTodoLists } = require("../../services/todoService");

const userIdSchema = Joi.number().integer().positive().required();

const getTodoLists = async (req, res) => {

  try {
    const userId = req.user.id;

    const { error } = userIdSchema.validate(userId);
    if (error) {
      return res.status(400).json({ error: "Invalid User ID in token" });
    }
    const todoLists = await getUserTodoLists(userId);

    res.status(200).json({
      message: "Todo lists fetched successfully",
      count: todoLists.length,
      lists: todoLists,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = { getTodoLists };
