const Joi = require("joi");

const {
  verifyItemOwnership,
  updateTodoItem,
} = require("../../services/todoItemService");

const updateItem = async (req, res) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(1).max(255),

    is_completed: Joi.number().valid(0, 1),

    position: Joi.number().integer().min(0),

    reminder_at: Joi.date().allow(null),
  })
    .min(1)
    .messages({
      "object.min": "At least one field is required",
    });

  try {
    const itemId = Number(req.params.itemId);

    if (!Number.isInteger(itemId)) {
      return res.status(400).json({
        error: "Invalid item id",
      });
    }

    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    const userId = req.user.id;

    const hasAccess = await verifyItemOwnership(itemId, userId);

    if (!hasAccess) {
      return res.status(403).json({
        error: "You do not have permission to update this item",
      });
    }

    const result = await updateTodoItem(itemId, value);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Todo item not found",
      });
    }

    res.status(200).json({
      message: "Todo item updated successfully",
      updatedFields: value,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = { updateItem };
