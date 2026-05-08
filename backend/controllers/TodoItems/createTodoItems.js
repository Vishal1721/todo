const Joi = require("joi");

const {
  verifyListOwnership,
  createTodoItem,
} = require("../../services/todoItemService");

const createItem = async (req, res) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(1).max(255).required().messages({
      "string.empty": "Title is required",
      "string.max": "Title cannot exceed 255 characters",
      "any.required": "Title is required",
    }),

    position: Joi.number().integer().min(0).optional().messages({
      "number.base": "Position must be a number",
      "number.integer": "Position must be an integer",
      "number.min": "Position cannot be negative",
    }),

    reminder_at: Joi.date().optional().messages({
      "date.base": "Reminder date is invalid",
    }),
  });

  try {
    const listId = Number(req.params.listId);

    if (!Number.isInteger(listId)) {
      return res.status(400).json({
        error: "Invalid list id",
      });
    }

    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    const userId = req.user.id;

    const hasAccess = await verifyListOwnership(listId, userId);

    if (!hasAccess) {
      return res.status(403).json({
        error: "You do not have access to this todo list",
      });
    }

    const item = await createTodoItem(
      listId,
      value.title,
      value.position ?? 0,
      value.reminder_at ?? null,
    );

    res.status(201).json({
      message: "Todo item created successfully",
      item,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = { createItem };
