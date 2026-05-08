const Joi = require("joi");
const { updateTodoList } = require("../../services/todoService");

const updateTodo = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(1).max(100).messages({
      "string.empty": "Name cannot be empty",
      "string.max": "Name cannot exceed 100 characters",
    }),

    is_public: Joi.number().valid(0, 1).messages({
      "any.only": "is_public must be 0 (private) or 1 (public)",
    }),
  })
    .min(1)
    .messages({
      "object.min": "At least one field must be provided for update",
    });

  try {
    const listId = Number(req.params.id);

    if (!Number.isInteger(listId)) {
      return res.status(400).json({
        error: "Invalid todo list id",
      });
    }

    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    const userId = req.user.id;

    const result = await updateTodoList(listId, userId, value);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Todo list not found or permission denied",
      });
    }

    res.status(200).json({
      message: "Todo list updated successfully",
      updatedFields: value,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = { updateTodo };
